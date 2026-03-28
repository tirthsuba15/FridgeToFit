const express = require('express');
const router = express.Router();
router.post('/extract', (req, res) => res.json({ status: 'stub' }));
router.get('/', (req, res) => res.json({ status: 'stub' }));
module.exports = router;
