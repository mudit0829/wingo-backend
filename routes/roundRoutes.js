const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// ✅ GET all rounds
router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find().sort({ createdAt: -1 }).limit(100);
    res.json(rounds);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching rounds' });
  }
});

// ✅ GET round by ID (optional)
router.get('/:id', async (req, res) => {
  try {
    const round = await Round.findById(req.params.id);
    if (!round) return res.status(404).json({ error: 'Round not found' });
    res.json(round);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching round by ID' });
  }
});

// ✅ Create new round (used internally or admin)
router.post('/create', async (req, res) => {
  try {
    const { roundId, result, isResultGenerated } = req.body;
    const newRound = new Round({ roundId, result, isResultGenerated });
    await newRound.save();
    res.status(201).json({ message: 'Round created', round: newRound });
  } catch (error) {
    res.status(500).json({ error: 'Error creating round' });
  }
});

// ✅ Get current active round
router.get('/current', async (req, res) => {
  try {
    const currentRound = await Round.findOne().sort({ createdAt: -1 });
    if (!currentRound) return res.status(404).json({ error: 'No round found' });
    res.json(currentRound);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching current round' });
  }
});

module.exports = router;
