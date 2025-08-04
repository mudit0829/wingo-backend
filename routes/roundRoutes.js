// routes/roundRoutes.js
const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// ✅ Get Latest 20 Rounds - (For Game History)
router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find()
                              .sort({ startTime: -1 })
                              .limit(20);
    res.json(rounds);
  } catch (err) {
    console.error('Fetch Rounds Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get Upcoming Future Rounds (For Admin Result Control)
router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const upcomingRounds = await Round.find({ startTime: { $gt: now } })
                                      .sort({ startTime: 1 })
                                      .limit(20);  // Next 20 rounds
    res.json(upcomingRounds);
  } catch (err) {
    console.error('Upcoming Rounds Error:', err);
    res.status(500).json({ message: 'Failed to fetch upcoming rounds' });
  }
});

module.exports = router;
