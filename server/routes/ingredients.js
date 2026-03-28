const express = require('express');
const router = express.Router();
const db = require('../db/index');
const multer = require('multer');
const { visionExtract } = require('../ai/prompt');

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/ingredients/extract
router.post('/extract', upload.single('image'), async (req, res) => {
  try {
    let ingredientNames = [];

    if (req.file) {
      // Image upload path: call visionExtract
      const base64 = req.file.buffer.toString('base64');
      try {
        const result = await visionExtract(base64);
        ingredientNames = result.ingredients;
      } catch (err) {
        console.error('[/extract] visionExtract error:', err.message);
        return res.status(502).json({ error: 'Vision AI unavailable' });
      }
    } else if (req.body.text) {
      // Text fallback path
      ingredientNames = req.body.text
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
    } else {
      return res.status(400).json({ error: 'image or text required' });
    }

    const ingredients = [];
    const insertStmt = db.prepare('INSERT OR IGNORE INTO ingredients (name) VALUES (?)');
    const selectStmt = db.prepare('SELECT * FROM ingredients WHERE LOWER(name) = LOWER(?)');

    for (const name of ingredientNames) {
      insertStmt.run(name.trim().toLowerCase());
      const row = selectStmt.get(name.trim().toLowerCase());
      if (row) {
        ingredients.push({ id: row.id, name: row.name, quantity_g: null });
      }
    }

    return res.json({ ingredients });
  } catch (e) {
    console.error('[/extract] error:', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/ingredients
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM ingredients').all();
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
