const express = require('express');
const router = express.Router();
const db = require('../db/index');
const { v4: uuidv4 } = require('uuid');
const { calculateTDEE } = require('../utils/tdee');
const { generateWorkoutPlan } = require('../ai/prompt');

// LEFTOVERS NOTE: Workout plans are generated ONCE and stored statically.
// PATCH /api/mealplan/:id/leftovers updates meal slot overrides only.
// It does NOT regenerate or modify workout_plans in any way.

// POST /api/workout/generate
router.post('/generate', async (req, res) => {
  try {
    const { meal_plan_id, user_id, equipment: reqEquipment } = req.body;
    if (!meal_plan_id && !user_id) return res.status(400).json({ error: 'meal_plan_id or user_id required' });

    // 1. Load user (from body user_id or via meal plan)
    let user;
    if (user_id) {
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(user_id);
    } else {
      const mealPlan = db.prepare('SELECT user_id FROM meal_plans WHERE id = ?').get(meal_plan_id);
      if (mealPlan) user = db.prepare('SELECT * FROM users WHERE id = ?').get(mealPlan.user_id);
    }
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 2. Verify meal plan exists (optional)
    const mealPlan = meal_plan_id
      ? db.prepare('SELECT id FROM meal_plans WHERE id = ?').get(meal_plan_id)
      : null;

    // 3. Resolve equipment
    const equipment = reqEquipment || JSON.parse(user.equipment || '[]');
    const resolvedEquipment = equipment.length > 0 ? equipment : ['Bodyweight Only'];

    // 4. Calculate TDEE
    const tdee = calculateTDEE(user);

    // 5. Generate workout via AI
    let workoutResult;
    try {
      workoutResult = await generateWorkoutPlan({
        goal: user.goal,
        activity_level: user.activity_level,
        equipment: resolvedEquipment,
        tdee,
      });
    } catch (err) {
      console.error('[workout/generate] AI error:', err.message);
      return res.status(502).json({ error: 'Workout AI unavailable' });
    }

    // 6. Save to DB (upsert on meal_plan_id if provided, else always insert)
    const id = uuidv4();
    const existing = meal_plan_id
      ? db.prepare('SELECT id FROM workout_plans WHERE meal_plan_id = ?').get(meal_plan_id)
      : null;

    try {
      if (existing) {
        db.prepare(`
          UPDATE workout_plans SET plan_json = ?, generated_at = datetime('now')
          WHERE meal_plan_id = ?
        `).run(JSON.stringify(workoutResult), meal_plan_id);
      } else {
        db.prepare(`
          INSERT INTO workout_plans (id, meal_plan_id, plan_json, generated_at)
          VALUES (?, ?, ?, datetime('now'))
        `).run(id, meal_plan_id || null, JSON.stringify(workoutResult));
      }
    } catch (err) {
      console.error('[workout/generate] DB error:', err.message);
      return res.status(500).json({ error: 'Failed to save workout plan' });
    }

    return res.json({
      id: existing ? existing.id : id,
      meal_plan_id,
      plan_json: workoutResult,
      plan: workoutResult,
      generated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('[workout/generate] error:', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/workout/:meal_plan_id
router.get('/:meal_plan_id', (req, res) => {
  try {
    const workout = db.prepare('SELECT * FROM workout_plans WHERE meal_plan_id = ?')
      .get(req.params.meal_plan_id);
    if (!workout) return res.status(404).json({ error: 'Workout plan not found' });
    return res.json({ ...workout, plan_json: JSON.parse(workout.plan_json) });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
