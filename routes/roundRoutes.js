// routes/roundRoutes.js
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

// ✅ Get Upcoming Future Rounds with Pagination (For Admin Panel)
router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const totalUpcoming = await Round.countDocuments({ startTime: { $gt: now } });

    const upcomingRounds = await Round.find({ startTime: { $gt: now } })
                                      .sort({ startTime: 1 })
                                      .skip(page * pageSize)
                                      .limit(pageSize);

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
