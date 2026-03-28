const express = require('express');
const router = express.Router();
const db = require('../db/index');
const requireUser = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const { calculateTDEE } = require('../utils/tdee');

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

// POST /api/workout/generate
router.post('/generate', requireUser, async (req, res) => {
  try {
    const { meal_plan_id } = req.body;
    if (!meal_plan_id) return res.status(400).json({ error: 'meal_plan_id required' });

    const user = req.user;
    const equipment = JSON.parse(user.equipment || '[]');

    const tdee = calculateTDEE({
      weight_kg: user.weight_kg,
      height_cm: user.height_cm,
      age: user.age,
      sex: user.sex,
      activity_level: user.activity_level
    });

    // Call Gordon's generateWorkoutPlan
    const workoutResult = await callGordon('/api/ai/workout', {
      goal: user.goal,
      activity_level: user.activity_level,
      equipment,
      tdee
    });

    const id = uuidv4();
    db.prepare(`
      INSERT INTO workout_plans (id, meal_plan_id, plan_json, generated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).run(id, meal_plan_id, JSON.stringify(workoutResult));

    return res.json({ id, meal_plan_id, plan: workoutResult });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/workout/:meal_plan_id
router.get('/:meal_plan_id', requireUser, (req, res) => {
  try {
    const workout = db.prepare(
      'SELECT * FROM workout_plans WHERE meal_plan_id = ?'
    ).get(req.params.meal_plan_id);
    if (!workout) return res.status(404).json({ error: 'Workout plan not found' });
    return res.json({ ...workout, plan_json: JSON.parse(workout.plan_json) });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
