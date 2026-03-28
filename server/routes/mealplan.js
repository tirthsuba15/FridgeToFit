const express = require('express');
const router = express.Router();
const db = require('../db/index');
const requireUser = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const { matchRecipes } = require('../utils/recipeMatcher');
const { calculateTDEE, getMacroTargets } = require('../utils/tdee');

// Gordon's AI endpoint base URL
const GORDON_BASE = process.env.GORDON_BASE_URL || 'http://localhost:3002';

async function callGordon(path, body) {
  const res = await fetch(`${GORDON_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Gordon API error: ${res.status}`);
  return res.json();
}

// POST /api/mealplan/generate
router.post('/generate', requireUser, async (req, res) => {
  try {
    const user = req.user;
    const dietary_flags = JSON.parse(user.dietary_flags || '[]');
    const cuisine_prefs = JSON.parse(user.cuisine_prefs || '[]');

    const tdee = calculateTDEE({
      weight_kg: user.weight_kg,
      height_cm: user.height_cm,
      age: user.age,
      sex: user.sex,
      activity_level: user.activity_level
    });
    const macros = getMacroTargets(tdee, user.goal);

    const allRecipes = db.prepare('SELECT * FROM recipes').all();
    const userIngredients = db.prepare('SELECT name FROM ingredients').all();
    const userIngredientNames = userIngredients.map(i => i.name);

    const matched = matchRecipes({
      recipes: allRecipes,
      userIngredientNames,
      dietary_flags,
      cuisine_prefs,
      threshold: 0.3  // lower threshold for plan generation
    });

    // Call Gordon's generateMealPlan
    const planResult = await callGordon('/api/ai/mealplan', {
      recipes: matched,
      tdee,
      macros,
      cuisines: cuisine_prefs,
      dietary: dietary_flags,
      budget: user.weekly_budget_usd,
      goal: user.goal
    });

    // planResult.days expected shape: { mon: { breakfast, lunch, dinner, snack }, ... }
    const planJson = planResult;

    const id = uuidv4();
    db.prepare(`
      INSERT INTO meal_plans (id, user_id, plan_json, generated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).run(id, user.id, JSON.stringify(planJson));

    // Init empty grocery list for this plan
    db.prepare(`
      INSERT INTO grocery_lists (meal_plan_id, items_json, leftover_overrides)
      VALUES (?, ?, ?)
    `).run(id, '[]', '[]');

    return res.json({ id, plan: planJson });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/mealplan/swap
router.post('/swap', requireUser, async (req, res) => {
  try {
    const { meal_plan_id, day, slot } = req.body;
    if (!meal_plan_id || !day || !slot) {
      return res.status(400).json({ error: 'meal_plan_id, day, slot required' });
    }

    const plan = db.prepare('SELECT * FROM meal_plans WHERE id = ? AND user_id = ?')
      .get(meal_plan_id, req.user.id);
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });

    const planJson = JSON.parse(plan.plan_json);
    const allRecipes = db.prepare('SELECT * FROM recipes').all();
    const userIngredients = db.prepare('SELECT name FROM ingredients').all();

    const swapResult = await callGordon('/api/ai/swap', {
      current_plan: planJson,
      day,
      slot,
      available_recipes: allRecipes,
      user_ingredients: userIngredients.map(i => i.name)
    });

    // Update that slot in plan_json
    if (planJson.days?.[day]) {
      planJson.days[day][slot] = {
        ...swapResult,
        is_leftover: false
      };
    }

    db.prepare('UPDATE meal_plans SET plan_json = ? WHERE id = ?')
      .run(JSON.stringify(planJson), meal_plan_id);

    return res.json({ updated_slot: planJson.days[day][slot] });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/mealplan/:id
router.get('/:id', requireUser, (req, res) => {
  try {
    const plan = db.prepare('SELECT * FROM meal_plans WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });
    return res.json({ ...plan, plan_json: JSON.parse(plan.plan_json) });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PATCH /api/mealplan/:id/leftovers
router.patch('/:id/leftovers', requireUser, (req, res) => {
  try {
    const { day, slot, is_leftover } = req.body;
    if (day === undefined || slot === undefined || is_leftover === undefined) {
      return res.status(400).json({ error: 'day, slot, is_leftover required' });
    }
    const plan = db.prepare('SELECT * FROM meal_plans WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });

    const planJson = JSON.parse(plan.plan_json);
    if (planJson.days?.[day]?.[slot]) {
      planJson.days[day][slot].is_leftover = is_leftover;
    }
    db.prepare('UPDATE meal_plans SET plan_json = ? WHERE id = ?')
      .run(JSON.stringify(planJson), req.params.id);

    const grocery = db.prepare('SELECT * FROM grocery_lists WHERE meal_plan_id = ?')
      .get(req.params.id);
    if (grocery) {
      let overrides = JSON.parse(grocery.leftover_overrides || '[]');
      const key = `${day}:${slot}`;
      if (is_leftover && !overrides.includes(key)) overrides.push(key);
      if (!is_leftover) overrides = overrides.filter(k => k !== key);
      db.prepare('UPDATE grocery_lists SET leftover_overrides = ? WHERE meal_plan_id = ?')
        .run(JSON.stringify(overrides), req.params.id);
    }
    return res.json({ updated: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
