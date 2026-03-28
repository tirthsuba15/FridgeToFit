const express = require('express');
const router = express.Router();
const db = require('../db/index');
const { v4: uuidv4 } = require('uuid');

// POST /api/users
router.post('/users', (req, res) => {
  try {
    const {
      session_token, height_cm, weight_kg, age, sex,
      activity_level, goal, dietary_flags, cuisine_prefs,
      equipment, weekly_budget_usd
    } = req.body;

    if (!session_token) return res.status(400).json({ error: 'session_token required' });

    const existing = db.prepare('SELECT * FROM users WHERE session_token = ?').get(session_token);
    if (existing) return res.json(existing);

    const id = uuidv4();
    db.prepare(`
      INSERT INTO users
        (id, session_token, height_cm, weight_kg, age, sex,
         activity_level, goal, dietary_flags, cuisine_prefs, equipment, weekly_budget_usd)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, session_token, height_cm, weight_kg, age, sex,
      activity_level, goal,
      JSON.stringify(dietary_flags || []),
      JSON.stringify(cuisine_prefs || []),
      JSON.stringify(equipment || []),
      weekly_budget_usd
    );

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
