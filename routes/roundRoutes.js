const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// ✅ Get Latest 20 Rounds (For Game History - Frontend)
router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find()
                              .sort({ startTime: -1 })
                              .limit(20);

    // Ensure roundId is formatted
    const formattedRounds = rounds.map(round => {
      let formattedRoundId = round.roundId;
      if (!formattedRoundId.startsWith('R-')) {
        const date = new Date(round.startTime);
        const yyyyMMdd = date.toISOString().split('T')[0].replace(/-/g, '');
        const suffix = String(round.roundId).slice(-5);
        formattedRoundId = `R-${yyyyMMdd}-${suffix}`;
      }
      return {
        ...round._doc,
        roundId: formattedRoundId
      };
    });

    res.json(formattedRounds);

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

    // Auto-generate virtual rounds if none exist
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

      totalUpcoming = 1000; // Simulate 1000 future rounds for pagination
    } else {
      // Format existing DB rounds properly
      upcomingRounds = upcomingRounds.map(round => {
        let formattedRoundId = round.roundId;
        if (!formattedRoundId.startsWith('R-')) {
          const date = new Date(round.startTime);
          const yyyyMMdd = date.toISOString().split('T')[0].replace(/-/g, '');
          const suffix = String(round.roundId).slice(-5);
          formattedRoundId = `R-${yyyyMMdd}-${suffix}`;
        }
        return {
          ...round._doc,
          roundId: formattedRoundId
        };
      });
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
