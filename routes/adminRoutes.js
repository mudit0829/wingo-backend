const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const Round = require('../models/round');
const User = require('../models/user');
const RechargeLog = require('../models/rechargeLog');
const RedeemLog = require('../models/redeemLog');
const { protect, admin } = require('../middleware/authenticate');

// Profit/Loss Summary API - GET /api/admin/profitLoss
router.get('/profitLoss', protect, admin, async (req, res) => {
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

// Timer Control APIs (Demo Only)
router.post('/timer/start', protect, admin, (req, res) => {
  console.log('Timer Started');
  res.json({ message: 'Timer started' });
});
router.post('/timer/stop', protect, admin, (req, res) => {
  console.log('Timer Stopped');
  res.json({ message: 'Timer stopped' });
});

// Manual Result Control API - POST /api/admin/manualResult
router.post('/manualResult', protect, admin, async (req, res) => {
  try {
    const { roundId, resultColor, resultNumber } = req.body;

    if (!roundId || !resultColor || resultNumber === undefined) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const round = await Round.findOne({ roundId });
    if (!round) {
      return res.status(404).json({ message: 'Round not found' });
    }

    // Overwrite Result
    round.resultColor = resultColor;
    round.resultNumber = resultNumber;
    await round.save();

    // Process Bets
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

      bet.resultNumber = resultNumber;
      await bet.save();
    }

    res.json({
      message: '✅ Manual Result Processed Successfully',
      roundId,
      resultColor,
      resultNumber,
      totalBets: bets.length,
      winners,
      totalDistributed
    });

  } catch (err) {
    console.error('Manual Result Error:', err);
    res.status(500).json({ message: 'Failed to process manual result' });
  }
});

// Admin Reports Route - GET /api/admin/reports?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
router.get('/reports', protect, admin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Import your models here if out of scope
    const RechargeLog = require('../models/rechargeLog');
    const RedeemLog = require('../models/redeemLog');

    // Get total recharge amount
    const totalRechargeAgg = await RechargeLog.aggregate([
      { $match: { date: dateFilter } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRecharge = totalRechargeAgg[0]?.total || 0;

    // Get total redeemed amount
    const totalRedeemAgg = await RedeemLog.aggregate([
      { $match: { date: dateFilter } },
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);
    const totalRedeem = totalRedeemAgg[0]?.total || 0;

    // User counts (active, inactive, total)
    const activeUsersCount = await User.countDocuments({ walletBalance: { $gt: 0 } });
    const inactiveUsersCount = await User.countDocuments({ walletBalance: 0 });
    const totalUsersCount = await User.countDocuments();

    // Fetch profitLoss (reuse /profitLoss route internal logic or compute here)
    // Here we just mimic by calling internal function (replace with your logic)
    const profitLossData = {
      totalBets: 0,
      totalPayouts: 0,
      profit: 0
    };

    res.json({
      totalRecharge,
      totalRedeem,
      activeUsers: activeUsersCount,
      inactiveUsers: inactiveUsersCount,
      totalUsers: totalUsersCount,
      profitLoss: profitLossData
    });
  } catch (err) {
    console.error('Admin reports error:', err);
    res.status(500).json({ message: 'Server error fetching admin reports' });
  }
});
module.exports = router;
