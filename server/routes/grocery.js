const express = require('express');
const router = express.Router();
const db = require('../db/index');
const requireUser = require('../middleware/auth');
const { estimateCost, getAisle } = require('../utils/cost');
const { calculateTDEE, getMacroTargets } = require('../utils/tdee');

// GET /api/grocery/:mealplan_id
router.get('/:mealplan_id', requireUser, (req, res) => {
  try {
    const { mealplan_id } = req.params;

    const plan = db.prepare('SELECT * FROM meal_plans WHERE id = ? AND user_id = ?')
      .get(mealplan_id, req.user.id);
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });

    const planJson = JSON.parse(plan.plan_json);
    const groceryRow = db.prepare('SELECT * FROM grocery_lists WHERE meal_plan_id = ?')
      .get(mealplan_id);
    const leftoverOverrides = groceryRow
      ? JSON.parse(groceryRow.leftover_overrides || '[]')
      : [];

    // Build set of leftover slot keys e.g. "mon:breakfast"
    const leftoverKeys = new Set(leftoverOverrides);

    // Also collect is_leftover flags from plan_json itself
    const days = planJson.days || {};
    for (const [day, slots] of Object.entries(days)) {
      for (const [slot, meal] of Object.entries(slots)) {
        if (meal?.is_leftover) leftoverKeys.add(`${day}:${slot}`);
      }
    }

    console.log('Grocery debug — sample meal:', JSON.stringify(Object.values(days)[0]));

    // Tally needed (non-leftover) and available (leftover) quantities per ingredient
    const needed = {};   // name → quantity_g needed to buy
    const available = {}; // name → quantity_g already cooked/available from leftovers

    const ownedIngredients = db.prepare('SELECT name FROM ingredients').all()
      .map(i => i.name.toLowerCase().trim());

    for (const [day, slots] of Object.entries(days)) {
      for (const [slot, meal] of Object.entries(slots)) {
        const key = `${day}:${slot}`;
        if (leftoverKeys.has(key)) continue;

        // Handle multiple possible field names from Gordon's AI output
        let ingredients =
          meal?.ingredients ||
          meal?.ingredient_list ||
          meal?.ingredientList ||
          meal?.recipe?.ingredients ||
          [];

        // If it's a string, parse it
        if (typeof ingredients === 'string') {
          try { ingredients = JSON.parse(ingredients); } catch { ingredients = []; }
        }

        // If ingredients is array of objects with name field, extract names
        if (Array.isArray(ingredients) && ingredients.length > 0 && typeof ingredients[0] === 'object') {
          ingredients = ingredients.map(i => i.name || i.ingredient || String(i));
        }

        const isLeftover = leftoverKeys.has(key);
        const target = isLeftover ? available : needed;

        for (const ing of ingredients) {
          const name = (typeof ing === 'string' ? ing : String(ing)).toLowerCase().trim();
          const qty = typeof ing === 'object' ? (ing.quantity_g || ing.quantity || 100) : 100;
          if (!name || name.length < 2) continue;

          // Skip if owned
          if (ownedIngredients.some(owned => name.includes(owned) || owned.includes(name))) continue;

          target[name] = (target[name] || 0) + qty;
        }
      }
    }

    // Grocery = needed minus what's already available from leftover slots
    const ingredientTotals = {};
    for (const [name, qty] of Object.entries(needed)) {
      const alreadyHave = available[name] || 0;
      const toBuy = qty - alreadyHave;
      if (toBuy > 0) {
        ingredientTotals[name] = { quantity_g: toBuy, aisle: getAisle(name) };
      }
    }

    // Build grouped grocery list
    const grouped = {};
    let total_cost_usd = 0;

    for (const [name, data] of Object.entries(ingredientTotals)) {
      const aisle = data.aisle;
      const cost = estimateCost(name, data.quantity_g);
      total_cost_usd += cost;

      if (!grouped[aisle]) grouped[aisle] = [];
      grouped[aisle].push({
        name,
        quantity_g: Math.round(data.quantity_g),
        estimated_cost_usd: cost
      });
    }

    total_cost_usd = Math.round(total_cost_usd * 100) / 100;

    // Save/update grocery_lists row
    const items_json = JSON.stringify(grouped);
    if (groceryRow) {
      db.prepare(`UPDATE grocery_lists SET items_json = ?, total_cost_usd = ?
        WHERE meal_plan_id = ?`)
        .run(items_json, total_cost_usd, mealplan_id);
    } else {
      db.prepare(`INSERT INTO grocery_lists (meal_plan_id, items_json, leftover_overrides, total_cost_usd)
        VALUES (?, ?, ?, ?)`)
        .run(mealplan_id, items_json, '[]', total_cost_usd);
    }

    return res.json({
      meal_plan_id: mealplan_id,
      leftover_meals_excluded: leftoverKeys.size,
      grouped,
      total_cost_usd
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/grocery/macro-summary/:mealplan_id
router.get('/macro-summary/:mealplan_id', requireUser, (req, res) => {
  try {
    const { mealplan_id } = req.params;

    const plan = db.prepare('SELECT * FROM meal_plans WHERE id = ? AND user_id = ?')
      .get(mealplan_id, req.user.id);
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });

    const user = req.user;
    const planJson = JSON.parse(plan.plan_json);
    const days = planJson.days || {};

    const tdee = calculateTDEE({
      weight_kg: user.weight_kg,
      height_cm: user.height_cm,
      age: user.age,
      sex: user.sex,
      activity_level: user.activity_level
    });
    const targets = getMacroTargets(tdee, user.goal);

    const DAY_ORDER = ['mon','tue','wed','thu','fri','sat','sun'];

    const dayTotals = DAY_ORDER.map(day => {
      const slots = days[day] || {};
      let calories = 0, protein_g = 0, carbs_g = 0, fat_g = 0;

      for (const [, meal] of Object.entries(slots)) {
        if (meal?.is_leftover) continue; // skip leftover meals

        const macros = meal?.macros || {};
        calories  += macros.calories  || 0;
        protein_g += macros.protein_g || 0;
        carbs_g   += macros.carbs_g   || 0;
        fat_g     += macros.fat_g     || 0;
      }

      const diff = calories - targets.calories;
      const status = Math.abs(diff) < 150 ? 'on_target'
        : diff > 0 ? 'over' : 'under';

      return {
        day,
        calories:    Math.round(calories),
        protein_g:   Math.round(protein_g),
        carbs_g:     Math.round(carbs_g),
        fat_g:       Math.round(fat_g),
        tdee_target: targets.calories,
        status
      };
    });

    // Weekly averages across days that have any calories
    const activeDays = dayTotals.filter(d => d.calories > 0);
    const count = activeDays.length || 1;
    const weekly_avg = {
      calories:    Math.round(activeDays.reduce((s, d) => s + d.calories, 0) / count),
      protein_g:   Math.round(activeDays.reduce((s, d) => s + d.protein_g, 0) / count),
      carbs_g:     Math.round(activeDays.reduce((s, d) => s + d.carbs_g, 0) / count),
      fat_g:       Math.round(activeDays.reduce((s, d) => s + d.fat_g, 0) / count),
      tdee_target: targets.calories
    };

    return res.json({
      meal_plan_id: mealplan_id,
      goal: user.goal,
      days: dayTotals,
      weekly_avg,
      macro_targets: targets
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
