// routes/cronRoutes.js
const express = require('express');
const { startTimer, generateResult } = require('../utils/gameLoop');
const router = express.Router();

router.get('/start-timer', async (req, res) => {
  startTimer(); // begins repeating 30s loop
  res.json({ msg: 'Timer started' });
});

router.post('/generate-result', async (req, res) => {
  const round = await generateResult(req.body.roundId);
  res.json({ msg: 'Result generated', round });
});

module.exports = router;
