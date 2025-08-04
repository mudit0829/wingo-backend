// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const Round = require('../models/round');
const User = require('../models/user');

// ✅ Profit/Loss Summary API - GET /api/cron/profitLoss
router.get('/profitLoss', async (req, res) => {
  try {
    const bets = await Bet.find({ win: { $ne: null } });

    let totalBets = 0;
    let totalPayouts = 0;

    bets.forEach(bet => {
      totalBets += bet.netAmount;
      if (bet.win) {
        let payout = 0;
        if (bet.colorBet === 'Red' || bet.colorBet === 'Green') payout = bet.netAmount * 2;
        else if (bet.colorBet === 'Violet') payout = bet.netAmount * 4.5;
        else if (bet.numberBet !== null) payout = bet.netAmount * 9;
        totalPayouts += payout;
      }
    });

    const profit = totalBets - totalPayouts;
    res.json({ totalBets, totalPayouts, profit });
  } catch (err) {
    console.error('Profit/Loss Error:', err);
    res.status(500).json({ message: 'Failed to fetch profit/loss' });
  }
});

// ✅ Start Timer API - POST /api/timer/start
router.post('/timer/start', (req, res) => {
  // For frontend demo purpose
  console.log('Timer Started');
  res.json({ message: 'Timer started' });
});

// ✅ Stop Timer API - POST /api/timer/stop
router.post('/timer/stop', (req, res) => {
  // For frontend demo purpose
  console.log('Timer Stopped');
  res.json({ message: 'Timer stopped' });
});

module.exports = router;
