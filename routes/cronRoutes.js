const express = require('express');
const { startTimer, generateResult } = require('../utils/gameLoop');
const router = express.Router();

router.get('/start-timer', async (req, res) => {
  try {
    console.log("🔁 Timer start request received");
    startTimer(); // begins repeating 30s loop
    res.json({ msg: 'Timer started' });
  } catch (error) {
    console.error("❌ Failed to start timer:", error);
    res.status(500).json({ error: 'Failed to start timer' });
  }
});

router.post('/generate-result', async (req, res) => {
  try {
    const round = await generateResult(req.body.roundId);
    res.json({ msg: 'Result generated', round });
  } catch (error) {
    console.error("❌ Error generating result:", error);
    res.status(500).json({ error: 'Failed to generate result' });
  }
});

module.exports = router;
