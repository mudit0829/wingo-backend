const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// ✅ Get Latest 20 Rounds (For Game Page History)
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

// ✅ Get Upcoming Rounds (DB first, Generate if Empty)
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

    // If no upcoming rounds → Generate Virtual Rounds Dynamically
    if (upcomingRounds.length === 0) {
      upcomingRounds = [];
      const startTimestamp = now.getTime();

      for (let i = 0; i < pageSize; i++) {
        const futureTime = new Date(startTimestamp + ((page * pageSize + i) * 30000)); // 30s interval
        const yyyyMMdd = futureTime.toISOString().split('T')[0].replace(/-/g, '');
        const suffix = String(Math.floor(futureTime.getTime() / 1000)).slice(-5);
        const roundId = `R-${yyyyMMdd}-${suffix}`;

        upcomingRounds.push({
          roundId,
          startTime: futureTime,
          resultNumber: null,
          resultColor: null
        });
      }

      totalUpcoming = 1000; // Simulated for pagination
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
