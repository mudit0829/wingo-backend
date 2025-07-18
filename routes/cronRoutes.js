const express = require('express');
const router = express.Router();
const Round = require('../models/Round');
const Bet = require('../models/Bet');

// POST /api/cron/start — create a new pending round
router.post('/start', async (req, res) => {
  const round = new Round();
  await round.save();
  res.json({ message: 'Timer started', roundId: round.roundId });
});

// POST /api/cron/generate-result — set result and timestamp for latest pending round
router.post('/generate-result', async (req, res) => {
  const colors = ['Red', 'Green', 'Violet'];
  const result = colors[Math.floor(Math.random() * colors.length)];

  const round = await Round.findOne({ result: null }).sort({ timestamp: -1 });
  if (!round) return res.status(400).json({ message: 'No round pending' });

  round.result = result;
  round.timestamp = new Date(); // overwrite timestamp
  await round.save();
  res.json({ message: 'Result generated', result });
});

module.exports = router;
