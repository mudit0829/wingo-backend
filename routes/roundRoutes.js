const express = require('express');
const router = express.Router();
const Round = require('../models/round');

router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find().sort({ createdAt: -1 }).limit(20);
    res.json(rounds);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
