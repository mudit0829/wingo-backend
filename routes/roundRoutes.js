const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// GET all rounds
router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find().sort({ timestamp: -1 });
    res.json(rounds);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching rounds' });
  }
});

// GET current round (last created round)
router.get('/current', async (req, res) => {
  try {
    const currentRound = await Round.findOne().sort({ createdAt: -1 });
    if (!currentRound) {
      return res.status(404).json({ error: 'No current round found' });
    }
    res.json(currentRound);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching current round' });
  }
});

// GET round by MongoDB _id
router.get('/:id', async (req, res) => {
  try {
    const round = await Round.findById(req.params.id);
    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }
    res.json(round);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching round by ID' });
  }
});

// POST create new round
router.post('/create', async (req, res) => {
  try {
    const latestRound = await Round.findOne().sort({ createdAt: -1 });
    const nextRoundId = latestRound ? parseInt(latestRound.roundId) + 1 : 1001;

    const newRound = new Round({
      roundId: nextRoundId.toString(),
      timestamp: new Date(),
    });

    await newRound.save();
    res.status(201).json({ message: 'Round created', round: newRound });
  } catch (err) {
    res.status(500).json({ error: 'Error creating new round' });
  }
});

module.exports = router;
