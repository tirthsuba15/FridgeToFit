const express = require('express');
const router = express.Router();
router.get('/:mealplan_id', (req, res) => res.json({ status: 'stub' }));
router.get('/macro-summary/:mealplan_id', (req, res) => res.json({ status: 'stub' }));
module.exports = router;
