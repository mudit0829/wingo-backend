// routes/roundRoutes.js

const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// GET all rounds
router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find().sort({ timestamp: -1 }).limit(50);
    res.json(rounds);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching rounds' });
  }
});

// GET current round (latest round with no result yet)
router.get('/current', async (req, res) => {
  try {
    const round = await Round.findOne({ result: null }).sort({ timestamp: -1 });
    if (!round) {
      return res.status(404).json({ error: 'No current round found' });
    }
    res.json(round);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching current round' });
  }
});

// GET specific round by ID
router.get('/:id', async (req, res) => {
  try {
    const round = await Round.findById(req.params.id);
    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }
    res.json(round);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching round by ID' });
  }
});

// POST create new round
router.post('/create', async (req, res) => {
  try {
    const { roundId, timestamp } = req.body;

    const newRound = new Round({
      roundId: roundId || Date.now().toString(),
      timestamp: timestamp || new Date(),
    });

    await newRound.save();
    res.json({ message: 'Round created', round: newRound });
  } catch (error) {
    res.status(500).json({ error: 'Error creating round' });
  }
});

module.exports = router;
