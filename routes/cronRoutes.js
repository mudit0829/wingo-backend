const express = require('express');
const router = express.Router();
const Round = require('../models/Round');

// Create a new round manually
router.get('/start-timer', async (req, res) => {
  try {
    const latestRound = await Round.findOne().sort({ createdAt: -1 });
    const newRoundId = latestRound ? latestRound.roundId + 1 : 1;

    const newRound = new Round({
      roundId: newRoundId,
      timestamp: new Date()
    });

    await newRound.save();
    res.json({ message: `New round ${newRoundId} started` });
  } catch (err) {
    console.error('Error creating new round:', err);
    res.status(500).json({ error: 'Failed to start new round' });
  }
});

module.exports = router;
