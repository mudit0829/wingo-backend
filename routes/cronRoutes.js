const express = require('express');
const router = express.Router();
const generateResult = require('../utils/generateResult');
const Round = require('../models/Round');

let timerRunning = false;
let timerInterval = null;

// Start 30s timer
router.post('/start-timer', (req, res) => {
  if (!timerRunning) {
    timerRunning = true;
    timerInterval = setInterval(async () => {
      await generateResult();
    }, 30000);
    return res.json({ message: '30s timer started!' });
  } else {
    return res.json({ message: 'Timer already running.' });
  }
});

// Manual trigger to generate result
router.post('/generate', async (req, res) => {
  try {
    const round = await generateResult();
    res.json({ success: true, round });
  } catch (error) {
    console.error('Error generating result:', error);
    res.status(500).json({ success: false, error: 'Failed to generate result' });
  }
});

module.exports = router;
