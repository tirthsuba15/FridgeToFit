const express = require('express');
const router = express.Router();
router.post('/generate', (req, res) => res.json({ status: 'stub' }));
router.post('/swap', (req, res) => res.json({ status: 'stub' }));
router.get('/:id', (req, res) => res.json({ status: 'stub' }));
router.patch('/:id/leftovers', (req, res) => res.json({ status: 'stub' }));
module.exports = router;
