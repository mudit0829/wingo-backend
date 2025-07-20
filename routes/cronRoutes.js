// routes/cronRoutes.js
const express = require('express');
const router = express.Router();
const Round = require('../models/Round');
const generateResult = require('../utils/generateResult');

router.post('/generate-result', async (req, res) => {
  try {
    const rounds = await Round.find({ result: null }).sort({ roundId: 1 });

    if (rounds.length === 0) {
      return res.status(400).json({ message: 'No rounds pending result generation' });
    }

    for (const round of rounds) {
      round.result = generateResult();
      round.timestamp = new Date(); // Give new timestamp for each round
      await round.save();
    }

    res.status(200).json({ message: 'Results generated successfully' });
  } catch (error) {
    console.error('Error generating results:', error);
    res.status(500).json({ message: 'Error generating results', error });
  }
});

module.exports = router;
