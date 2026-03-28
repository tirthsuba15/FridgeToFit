const express = require('express');
const router = express.Router();
const db = require('../db/index');
const requireUser = require('../middleware/auth');
const { matchRecipes } = require('../utils/recipeMatcher');

// GET /api/recipes/match?user_id=X
router.get('/match', requireUser, (req, res) => {
  try {
    const user_id = req.query.user_id || req.user.id;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const dietary_flags = JSON.parse(user.dietary_flags || '[]');
    const cuisine_prefs = JSON.parse(user.cuisine_prefs || '[]');

    // Get user's saved ingredients
    const userIngredients = db.prepare('SELECT name FROM ingredients').all();
    const userIngredientNames = userIngredients.map(i => i.name);

    const recipes = db.prepare('SELECT * FROM recipes').all();

    const threshold = userIngredientNames.length > 0 ? 0.3 : 0;
    const matched = matchRecipes({
      recipes,
      userIngredientNames: userIngredientNames.length > 0 ? userIngredientNames : [''],
      dietary_flags,
      cuisine_prefs,
      threshold,
    });

    return res.json({
      count: matched.length,
      recipes: matched.map(r => ({
        id: r.id,
        name: r.name,
        cuisine_tag: r.cuisine_tag,
        prep_time_min: r.prep_time_min,
        match_score: Math.round(r.match_score * 100),
        ingredient_list: JSON.parse(r.ingredient_list || '[]'),
        image_url: r.image_url
      }))
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
