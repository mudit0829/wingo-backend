const express = require('express');
const router = express.Router();
const Round = require('../models/round');

router.get('/current', async (req, res) => {
  try {
    const latestRound = await Round.findOne().sort({ timestamp: -1 });

    if (!latestRound) return res.status(404).json({ error: 'No active round' });

    const now = new Date();
    const timePassed = (now - new Date(latestRound.timestamp)) / 1000;
    const timeLeft = Math.max(0, 30 - Math.floor(timePassed));

    res.json({
      roundId: latestRound.roundId,
      timestamp: latestRound.timestamp,
      timeLeft
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch current round' });
  }
});

module.exports = router;
