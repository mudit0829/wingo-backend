const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// ✅ Get Latest 20 Rounds (For Game History - Frontend)
router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find()
                              .sort({ startTime: -1 })
                              .limit(20);

    // Format Round IDs
    const formattedRounds = rounds.map(round => {
      let roundId = round.roundId;
      if (!roundId.startsWith('R-')) {
        const suffix = String(round.roundId).slice(-5);
        roundId = `R-${suffix}`;
      }
      return {
        ...round._doc,
        roundId
      };
    });

    res.json(formattedRounds);

  } catch (err) {
    console.error('Fetch Rounds Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get Upcoming Rounds (DB first, Virtual if Empty)
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

    // If no upcoming rounds in DB → Generate Virtual Rounds
    if (upcomingRounds.length === 0) {
      upcomingRounds = [];
      const startTimestamp = now.getTime();

      for (let i = 0; i < pageSize; i++) {
        const futureTime = new Date(startTimestamp + ((page * pageSize + i) * 30000)); // 30s interval
        const suffix = String(Math.floor(futureTime.getTime() / 1000)).slice(-5);
        const roundId = `R-${suffix}`;

        upcomingRounds.push({
          roundId,
          startTime: futureTime,
          resultNumber: null,
          resultColor: null
        });
      }

      totalUpcoming = 1000; // Simulated 1000 rounds
    } else {
      // Format DB fetched rounds
      upcomingRounds = upcomingRounds.map(round => {
        let roundId = round.roundId;
        if (!roundId.startsWith('R-')) {
          const suffix = String(round.roundId).slice(-5);
          roundId = `R-${suffix}`;
        }
        return {
          ...round._doc,
          roundId
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
