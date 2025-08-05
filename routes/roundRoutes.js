const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// ✅ Get Latest 20 Rounds (For Game History - Frontend)
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

// ✅ Get Upcoming Rounds with Pagination (Auto-generate if DB empty)
router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;

    let upcomingRounds = await Round.find({ startTime: { $gt: now } })
                                    .sort({ startTime: 1 })
                                    .skip(page * pageSize)
                                    .limit(pageSize);

    let totalUpcoming = await Round.countDocuments({ startTime: { $gt: now } });

    // If no upcoming rounds exist, generate virtual rounds dynamically
    if (upcomingRounds.length === 0) {
      upcomingRounds = [];
      const startTimestamp = now.getTime();

      for (let i = 1; i <= pageSize; i++) {
        const futureTime = new Date(startTimestamp + (i + (page * pageSize)) * 30000); // 30s per round
        upcomingRounds.push({
          roundId: `R${Math.floor(futureTime.getTime() / 1000)}`,
          startTime: futureTime,
          resultNumber: null,
          resultColor: null
        });
      }

      totalUpcoming = 1000;  // Simulate 1000 future rounds for pagination
    }

    res.json({
      total: totalUpcoming,
      page,
      pageSize,
      rounds: upcomingRounds
    });
  } catch (err) {
    console.error('Upcoming Rounds Error:', err);
    res.status(500).json({ message: 'Failed to fetch upcoming rounds' });
  }
});

module.exports = router;
