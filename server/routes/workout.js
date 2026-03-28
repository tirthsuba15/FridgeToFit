const express = require('express');
const router = express.Router();
router.post('/generate', (req, res) => res.json({ status: 'stub' }));
router.get('/:meal_plan_id', (req, res) => res.json({ status: 'stub' }));
module.exports = router;
