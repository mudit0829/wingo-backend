const express = require('express');
const router = express.Router();
const Round = require('../models/Round');

// Get all rounds sorted latest first
router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find().sort({ timestamp: -1 }).limit(50);
    res.json(rounds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rounds' });
  }
});

module.exports = router;
