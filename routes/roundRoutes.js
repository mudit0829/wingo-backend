const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// ✅ Get Latest Rounds (Filter by gameType)
router.get('/', async (req, res) => {
  try {
    const { gameType } = req.query;
    if (!gameType) {
      return res.status(400).json({ message: 'gameType is required' });
    }
    const rounds = await Round.find({ gameType })
      .sort({ startTime: -1 })
      .limit(20);
    res.json(rounds);
  } catch (err) {
    console.error('Fetch Rounds Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get Upcoming Rounds (Filter by gameType)
router.get('/upcoming', async (req, res) => {
  try {
    const { gameType } = req.query;
    if (!gameType) {
      return res.status(400).json({ message: 'gameType is required' });
    }

    const now = new Date();
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const duration = getGameDuration(gameType);
    const filter = { startTime: { $gt: now }, gameType };

    let upcomingRounds = await Round.find(filter)
      .sort({ startTime: 1 })
      .skip(page * pageSize)
      .limit(pageSize);

    let totalUpcoming = await Round.countDocuments(filter);

    // If no rounds in DB, generate virtual placeholders
    if (upcomingRounds.length === 0) {
      upcomingRounds = [];
      for (let i = 0; i < pageSize; i++) {
        const futureTime = new Date(now.getTime() + ((page * pageSize + i) * duration));
        const yyyyMMdd = futureTime.toISOString().split('T')[0].replace(/-/g, '');
        const suffix = String(Math.floor(futureTime.getTime() / 1000)).slice(-5);
        const roundId = `${gameType}-${yyyyMMdd}-${suffix}`;
        upcomingRounds.push({
          roundId,
          startTime: futureTime,
          gameType,
          resultNumber: null,
          resultColor: null
        });
      }
      totalUpcoming = 1000; // simulated
    }

    res.json({ total: totalUpcoming, page, pageSize, rounds: upcomingRounds });
  } catch (err) {
    console.error('Upcoming Rounds Error:', err);
    res.status(500).json({ message: 'Failed to fetch upcoming rounds' });
  }
});

// ✅ New: Get Current Active Round for gameType
router.get('/current', async (req, res) => {
  try {
    const { gameType } = req.query;
    if (!gameType || !['WIN30', 'WIN1', 'WIN3', 'WIN5'].includes(gameType)) {
      return res.status(400).json({ message: 'Valid gameType is required' });
    }

    const round = await Round.findOne({ gameType })
      .sort({ startTime: -1 })
      .lean();

    if (!round) {
      return res.status(404).json({ message: 'No active round found' });
    }

    const gameDurations = { WIN30: 30000, WIN1: 60000, WIN3: 180000, WIN5: 300000 };
    const duration = gameDurations[gameType];
    const endTime = new Date(new Date(round.startTime).getTime() + duration);

    res.json({
      ...round,
      duration,
      endTime
    });
  } catch (err) {
    console.error('Fetch current round error:', err);
    res.status(500).json({ message: 'Server error fetching current round' });
  }
});

// Helper for durations
function getGameDuration(gameType) {
  switch (gameType) {
    case 'WIN1': return 60000;
    case 'WIN3': return 180000;
    case 'WIN5': return 300000;
    default: return 30000;
  }
}

module.exports = router;
