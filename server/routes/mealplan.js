const express = require('express');
const router = express.Router();
const db = require('../db/index');
const requireUser = require('../middleware/auth');

// POST /api/mealplan/generate — stub (Phase 4)
router.post('/generate', requireUser, (req, res) => res.json({ status: 'stub' }));

// POST /api/mealplan/swap — stub (Phase 4)
router.post('/swap', requireUser, (req, res) => res.json({ status: 'stub' }));

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

    // Update is_leftover flag on the target slot
    if (planJson.days?.[day]?.[slot]) {
      planJson.days[day][slot].is_leftover = is_leftover;
    }
    db.prepare('UPDATE meal_plans SET plan_json = ? WHERE id = ?')
      .run(JSON.stringify(planJson), req.params.id);

    // Update grocery_lists.leftover_overrides
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
