const express = require('express');
const router = express.Router();
const db = require('../db/index');
const requireUser = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/ingredients/extract
// Accepts JSON body { ingredients: [...] } OR multipart with image field
router.post('/extract', requireUser, upload.single('image'), async (req, res) => {
  try {
    // Image path: forward to Gordon's visionExtract
    if (req.file) {
      // Stub for Gordon's visionExtract integration
      // TODO: replace with actual call once Gordon exposes endpoint
      const extracted = { status: 'vision_stub', file: req.file.originalname };
      return res.json(extracted);
    }

    // JSON path
    const { ingredients } = req.body;
    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'ingredients must be an array' });
    }

    const saved = [];
    const insert = db.prepare(`
      INSERT OR IGNORE INTO ingredients (name) VALUES (?)
    `);
    for (const name of ingredients) {
      if (typeof name === 'string' && name.trim()) {
        insert.run(name.trim().toLowerCase());
        const row = db.prepare('SELECT * FROM ingredients WHERE name = ?').get(name.trim().toLowerCase());
        saved.push(row);
      }
    }

    return res.json({ saved });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/ingredients
router.get('/', requireUser, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM ingredients').all();
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
