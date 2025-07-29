const express = require('express');
const router = express.Router();
const round = require('../models/round');

// GET all rounds (latest first)
router.get('/', async (req, res) => {
  try {
    const rounds = await round.find().sort({ timestamp: -1 }).limit(50);
    res.json(rounds);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rounds', error });
  }
});

// GET round by ID
router.get('/:roundId', async (req, res) => {
  try {
    const foundRound = await round.findOne({ roundId: req.params.roundId });
    if (!foundRound) return res.status(404).json({ message: 'Round not found' });
    res.json(foundRound);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving round', error });
  }
});

module.exports = router;
