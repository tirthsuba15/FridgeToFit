const express = require('express');
const router = express.Router();
router.get('/match', (req, res) => res.json({ status: 'stub' }));
module.exports = router;
