const express = require('express');
const router = express.Router();
const Round = require('../models/Round');
const generateAndSaveResult = require('../utils/generateResult');

// 🔁 Create new round manually
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
    console.error('Error starting new round:', err);
    res.status(500).json({ error: 'Failed to start round' });
  }
});

// ✅ Generate result for the latest round
router.get('/generate-result', async (req, res) => {
  try {
    const result = await generateAndSaveResult();
    res.json({ message: `Result generated for roundId ${result.roundId}`, result: result.result });
  } catch (error) {
    console.error('Error generating result:', error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
