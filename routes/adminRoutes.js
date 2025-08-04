const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');

// ✅ Profit/Loss Summary API - GET /api/admin/profitLoss
router.get('/profitLoss', async (req, res) => {
  try {
    const bets = await Bet.find({ win: { $ne: null } });

    let totalBets = 0;
    let totalPayouts = 0;

    bets.forEach(bet => {
      totalBets += bet.netAmount;
      if (bet.win) {
        let payout = 0;

        // Color Bet Logic
        if (bet.colorBet === 'Red' || bet.colorBet === 'Green') {
          if (bet.resultNumber === 0 || bet.resultNumber === 5) {
            payout = bet.netAmount * 1.5;
          } else {
            payout = bet.netAmount * 2;
          }
        } else if (bet.colorBet === 'Violet') {
          payout = bet.netAmount * 4.5;
        }

        // Number Bet Logic
        if (bet.numberBet != null && bet.numberBet === bet.resultNumber) {
          payout += bet.netAmount * 9;
        }

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

// ✅ Timer Control APIs (Demo Only)
router.post('/timer/start', (req, res) => {
  console.log('Timer Started');
  res.json({ message: 'Timer started' });
});

router.post('/timer/stop', (req, res) => {
  console.log('Timer Stopped');
  res.json({ message: 'Timer stopped' });
});

module.exports = router;
