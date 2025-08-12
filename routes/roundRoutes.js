const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// ✅ Get Latest Rounds (Filter by gameType if provided)
router.get('/', async (req, res) => {
  try {
    const { gameType } = req.query;
    const filter = {};

    if (gameType) {
      filter.gameType = gameType;
    }

    const rounds = await Round.find(filter)
                              .sort({ startTime: -1 })
                              .limit(20);

    res.json(rounds);
  } catch (err) {
    console.error('Fetch Rounds Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get Upcoming Rounds (Filter by gameType if provided)
router.get('/upcoming', async (req, res) => {
  try {
    const { gameType } = req.query;
    const now = new Date();
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const filter = { startTime: { $gt: now } };
    if (gameType) {
      filter.gameType = gameType;
    }

    let upcomingRounds = await Round.find(filter)
                                    .sort({ startTime: 1 })
                                    .skip(page * pageSize)
                                    .limit(pageSize);

    let totalUpcoming = await Round.countDocuments(filter);

    // If database has no future rounds → generate virtual rounds instead
    if (upcomingRounds.length === 0) {
      upcomingRounds = [];
      const startTimestamp = now.getTime();
      const duration = getGameDuration(gameType); // helper below

      for (let i = 0; i < pageSize; i++) {
        const futureTime = new Date(startTimestamp + ((page * pageSize + i) * duration));
        const yyyyMMdd = futureTime.toISOString().split('T')[0].replace(/-/g, '');
        const suffix = String(Math.floor(futureTime.getTime() / 1000)).slice(-5);
        const roundId = `${gameType || 'R'}-${yyyyMMdd}-${suffix}`;
        upcomingRounds.push({
          roundId,
          startTime: futureTime,
          gameType: gameType || null,
          resultNumber: null,
          resultColor: null
        });
      }
      totalUpcoming = 1000; // fake pagination total
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

// ✅ Helper for upcoming virtual round duration
function getGameDuration(gameType) {
  switch (gameType) {
    case 'WIN1': return 60000;
    case 'WIN3': return 180000;
    case 'WIN5': return 300000;
    default: return 30000; // WIN30 default
  }
}

module.exports = router;
