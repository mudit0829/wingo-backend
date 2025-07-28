const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Round = require('../models/round');

// GET all rounds
router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find().sort({ createdAt: -1 });
    res.json(rounds);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching rounds' });
  }
});

// GET current round (latest one)
router.get('/current', async (req, res) => {
  try {
    const latestRound = await Round.findOne().sort({ createdAt: -1 });
    if (!latestRound) {
      return res.status(404).json({ error: 'No current round found' });
    }
    res.json(latestRound);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching current round' });
  }
});

// GET round by MongoDB _id (safe)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid round ID format' });
    }

    const round = await Round.findById(id);
    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }

    res.json(round);
  } catch (err) {
    console.error('Error in /api/rounds/:id', err);
    res.status(500).json({ error: 'Error fetching round by ID' });
  }
});

// GET round by roundId (e.g. 1005)
router.get('/by-roundId/:roundId', async (req, res) => {
  try {
    const round = await Round.findOne({ roundId: req.params.roundId });
    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }
    res.json(round);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching round by roundId' });
  }
});

module.exports = router;
