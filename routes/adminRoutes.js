const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const Round = require('../models/round');
const User = require('../models/user');

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
        if (bet.colorBet === 'Red' || bet.colorBet === 'Green') payout = bet.netAmount * 2;
        else if (bet.colorBet === 'Violet') payout = bet.netAmount * 4.5;
        if (bet.numberBet != null) payout += bet.netAmount * 9;
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

// ✅ Timer Start API - POST /api/admin/timer/start
router.post('/timer/start', (req, res) => {
  console.log('⏱️ Timer Started (Manual Trigger)');
  res.json({ message: 'Timer started manually' });
});

// ✅ Timer Stop API - POST /api/admin/timer/stop
router.post('/timer/stop', (req, res) => {
  console.log('⏹️ Timer Stopped (Manual Trigger)');
  res.json({ message: 'Timer stopped manually' });
});

// ✅ Manual Result Control - POST /api/admin/manualResult
router.post('/manualResult', async (req, res) => {
  try {
    const { roundId, resultNumber, resultColor } = req.body;

    const round = await Round.findOne({ roundId });
    if (!round) {
      return res.status(404).json({ message: 'Round not found' });
    }

    round.resultNumber = resultNumber;
    round.resultColor = resultColor;
    await round.save();

    // Process Bets for this Round
    const bets = await Bet.find({ roundId });
    let winners = 0;
    let totalDistributed = 0;

    for (const bet of bets) {
      let winAmount = 0;
      const netAmount = bet.netAmount;

      // Color Bet Logic
      if (bet.colorBet) {
        if (resultColor === 'Violet' && bet.colorBet === 'Violet') {
          winAmount += Math.floor(netAmount * 4.5);
        } else if (resultColor === bet.colorBet) {
          if (resultNumber === 0 || resultNumber === 5) {
            winAmount += Math.floor(netAmount * 1.5);
          } else {
            winAmount += Math.floor(netAmount * 2);
          }
        }
      }

      // Number Bet Logic
      if (bet.numberBet != null && bet.numberBet === resultNumber) {
        winAmount += Math.floor(netAmount * 9);
      }

      if (winAmount > 0) {
        const user = await User.findOne({ email: bet.email });
        if (user) {
          user.wallet += winAmount;
          await user.save();
        }
        bet.win = true;
        winners++;
        totalDistributed += winAmount;
      } else {
        bet.win = false;
      }

      await bet.save();
    }

    res.json({
      message: `✅ Result manually set for Round ${roundId}`,
      resultNumber,
      resultColor,
      totalBets: bets.length,
      winners,
      totalDistributed
    });

  } catch (err) {
    console.error('Manual Result Error:', err);
    res.status(500).json({ message: 'Failed to set manual result' });
  }
});

module.exports = router;
