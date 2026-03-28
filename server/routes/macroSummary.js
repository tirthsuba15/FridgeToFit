const express = require('express');
const router = express.Router();
const db = require('../db/index');
const requireUser = require('../middleware/auth');
const { calculateTDEE, getMacroTargets } = require('../utils/tdee');

// GET /api/macro-summary/:mealplan_id
router.get('/:mealplan_id', requireUser, (req, res) => {
  try {
    const { mealplan_id } = req.params;

    const plan = db.prepare('SELECT * FROM meal_plans WHERE id = ? AND user_id = ?')
      .get(mealplan_id, req.user.id);
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });

    const user = req.user;
    const planJson = JSON.parse(plan.plan_json);
    // Normalize array-style days [{day, meals:[{slot,...}]}] → {mon:{breakfast:{...}}}
    const rawDays = planJson.days || {};
    let days = rawDays;
    if (Array.isArray(rawDays)) {
      days = {};
      for (const d of rawDays) {
        const key = (d.day || '').toLowerCase().slice(0, 3);
        days[key] = {};
        for (const m of (d.meals || [])) { days[key][m.slot] = m; }
      }
    }

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
        if (meal?.is_leftover) continue;

        const macros = meal?.macros || {};
        calories  += macros.calories  || macros.kcal || 0;
        protein_g += macros.protein_g || macros.protein || 0;
        carbs_g   += macros.carbs_g   || macros.carbs || 0;
        fat_g     += macros.fat_g     || macros.fat || 0;
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
