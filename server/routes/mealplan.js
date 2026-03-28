const express = require('express');
const router = express.Router();
const db = require('../db/index');
const { v4: uuidv4 } = require('uuid');
const { calculateTDEE, getMacroTargets } = require('../utils/tdee');
const { generateMealPlan, swapMeal, generateSummary } = require('../ai/prompt');

// POST /api/mealplan/generate
router.post('/generate', async (req, res) => {
  try {
    const { user_id, ingredient_ids, cuisine_prefs: reqCuisines, dietary_flags: reqDietary } = req.body;

    // 1. Load user
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 2. Calculate TDEE
    const tdee = calculateTDEE(user);

    // 3. Parse user fields (override with request body if provided)
    const dietary_flags = reqDietary || JSON.parse(user.dietary_flags || '[]');
    const cuisine_prefs = reqCuisines || JSON.parse(user.cuisine_prefs || '[]');

    // 4. Load matching recipes
    let recipes;
    if (Array.isArray(ingredient_ids) && ingredient_ids.length > 0) {
      const placeholders = ingredient_ids.map(() => '?').join(',');
      recipes = db.prepare(`
        SELECT r.id, r.name, r.cuisine_tag, r.prep_time_min
        FROM recipes r
        JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        WHERE ri.ingredient_id IN (${placeholders})
        GROUP BY r.id
        LIMIT 30
      `).all(...ingredient_ids);
    } else {
      recipes = db.prepare('SELECT id, name, cuisine_tag, prep_time_min FROM recipes ORDER BY id LIMIT 30').all();
    }

    // Map to format expected by AI
    const recipePool = recipes.map(r => ({
      recipe_id: r.id,
      name: r.name,
      cuisine_tag: r.cuisine_tag,
      prep_time_min: r.prep_time_min,
      dietary: [], // DB recipes don't have dietary tags; AI filters by provided list
    }));

    // 5. Build macros from TDEE
    const macros = getMacroTargets(tdee, user.goal);

    // 6. Generate meal plan via AI
    let mealPlan;
    try {
      mealPlan = await generateMealPlan({
        recipes: recipePool,
        tdee,
        macros,
        cuisines: cuisine_prefs,
        dietary: dietary_flags,
        budget: user.weekly_budget_usd,
      });
    } catch (err) {
      console.error('[mealplan/generate] AI error:', err.message);
      return res.status(502).json({ error: 'Meal plan AI unavailable' });
    }

    // 7. Generate summary via AI
    let summaryResult;
    try {
      summaryResult = await generateSummary({
        goal: user.goal,
        cuisine_choices: cuisine_prefs,
        budget: user.weekly_budget_usd,
        weekly_avg_calories: tdee,
      });
    } catch (err) {
      console.error('[mealplan/generate] summary error:', err.message);
      summaryResult = { summary: '' };
    }

    // 8. Attach summary
    const fullPlan = { ...mealPlan, summary: summaryResult.summary };

    // 9. Save to DB
    const id = uuidv4();
    try {
      db.prepare(`
        INSERT INTO meal_plans (id, user_id, plan_json, generated_at)
        VALUES (?, ?, ?, datetime('now'))
      `).run(id, user_id, JSON.stringify(fullPlan));
    } catch (err) {
      console.error('[mealplan/generate] DB error:', err.message);
      return res.status(500).json({ error: 'Failed to save meal plan' });
    }

    // 10. Return parsed plan
    return res.json({
      id,
      user_id,
      plan_json: fullPlan,
      generated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('[mealplan/generate] error:', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/mealplan/swap
router.post('/swap', async (req, res) => {
  try {
    const { meal_plan_id, day, slot } = req.body;

    // 1. Load meal plan
    const planRow = db.prepare('SELECT * FROM meal_plans WHERE id = ?').get(meal_plan_id);
    if (!planRow) return res.status(404).json({ error: 'Meal plan not found' });

    // 2. Find current meal at { day, slot }
    const plan = JSON.parse(planRow.plan_json);
    const dayObj = plan.days
      ? plan.days.find(d => d.day === day)
      : null;
    const currentMeal = dayObj
      ? dayObj.meals.find(m => m.slot === slot)
      : null;

    if (!dayObj || !currentMeal) {
      return res.status(404).json({ error: 'Slot not found in plan' });
    }

    // 3. Load user for dietary flags
    const user = db.prepare('SELECT dietary_flags, weekly_budget_usd FROM users WHERE id = ?')
      .get(planRow.user_id);
    const dietaryFlags = user ? JSON.parse(user.dietary_flags || '[]') : [];

    // 4. Build swap pool: 10 random recipes != current
    const swapRecipes = db.prepare(
      'SELECT id, name, prep_time_min FROM recipes WHERE id != ? ORDER BY RANDOM() LIMIT 10'
    ).all(currentMeal.recipe_id);

    const swapPool = swapRecipes.map(r => ({
      recipe_id: r.id,
      recipe_name: r.name,
      prep_time_min: r.prep_time_min,
    }));

    // 5. Approximate macro_remaining
    const macroRemaining = { protein: 50, carbs: 75, fat: 25 };

    // 6. Call swapMeal AI
    let swapResult;
    try {
      swapResult = await swapMeal({
        current_recipe: {
          recipe_id: currentMeal.recipe_id,
          recipe_name: currentMeal.recipe_name,
          prep_time_min: currentMeal.prep_time_min,
        },
        slot,
        user_dietary: dietaryFlags,
        macro_remaining: macroRemaining,
        matched_pool: swapPool,
      });
    } catch (err) {
      console.error('[mealplan/swap] AI error:', err.message);
      return res.status(502).json({ error: 'Swap AI unavailable' });
    }

    // 7. Update plan_json in DB
    currentMeal.recipe_id = swapResult.recipe_id;
    currentMeal.recipe_name = swapResult.recipe_name;
    currentMeal.prep_time_min = swapResult.prep_time_min;

    db.prepare('UPDATE meal_plans SET plan_json = ? WHERE id = ?')
      .run(JSON.stringify(plan), meal_plan_id);

    // 8. Return swap result
    return res.json({
      meal_plan_id,
      day,
      slot,
      new_recipe: { id: swapResult.recipe_id, name: swapResult.recipe_name },
    });
  } catch (e) {
    console.error('[mealplan/swap] error:', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/mealplan/:id
router.get('/:id', (req, res) => {
  try {
    const plan = db.prepare('SELECT * FROM meal_plans WHERE id = ?').get(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });
    return res.json({ ...plan, plan_json: JSON.parse(plan.plan_json) });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PATCH /api/mealplan/:id/leftovers
router.patch('/:id/leftovers', (req, res) => {
  try {
    const { day, slot, is_leftover } = req.body;
    if (day === undefined || slot === undefined || is_leftover === undefined) {
      return res.status(400).json({ error: 'day, slot, is_leftover required' });
    }
    const plan = db.prepare('SELECT * FROM meal_plans WHERE id = ?').get(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });

    const planJson = JSON.parse(plan.plan_json);
    const dayObj = planJson.days ? planJson.days.find(d => d.day === day) : null;
    if (dayObj) {
      const meal = dayObj.meals ? dayObj.meals.find(m => m.slot === slot) : null;
      if (meal) meal.is_leftover = is_leftover;
    }

    db.prepare('UPDATE meal_plans SET plan_json = ? WHERE id = ?')
      .run(JSON.stringify(planJson), req.params.id);

    return res.json({ updated: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
