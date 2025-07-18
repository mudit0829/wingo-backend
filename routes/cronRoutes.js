// cronRoutes.js
const express = require('express');
const router = express.Router();
const Round = require('../models/Round');
const Bet = require('../models/Bet');
const generateResult = require('../utils/generateResult');

router.post('/generate-result', async (req, res) => {
  try {
    const latestRound = await Round.findOne().sort({ timestamp: -1 });

    if (!latestRound || !latestRound.roundId) {
      return res.status(400).json({ message: 'No valid round to generate result for' });
    }

    const result = generateResult();

    latestRound.result = result;
    await latestRound.save();

    res.status(200).json({ message: 'Result generated', result });
  } catch (error) {
    console.error('❌ Error generating result:', error);
    res.status(500).json({ message: 'Failed to generate result' });
  }
});

module.exports = router;
