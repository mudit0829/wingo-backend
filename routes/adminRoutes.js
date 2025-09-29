const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const Round = require('../models/round');
const User = require('../models/user');
const RechargeLog = require('../models/rechargeLog');
const RedeemLog = require('../models/redeemLog');
const { protect, admin } = require('../middleware/authenticate');

// Get list of users for admin panel, optionally filter by email
router.get('/users', protect, admin, async (req, res) => {
  try {
    const email = req.query.email;
    let users;
    if (email) {
      users = await User.find({ email: new RegExp(email, 'i') });
    } else {
      users = await User.find({});
    }
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get list of agents
router.get('/agents', protect, admin, async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' });
    res.json(agents);
  } catch (err) {
    console.error('Error fetching agents:', err);
    res.status(500).json({ message: 'Failed to fetch agents' });
  }
});

// Get list of rounds
router.get('/rounds', protect, admin, async (req, res) => {
  try {
    const rounds = await Round.find({});
    res.json(rounds);
  } catch (err) {
    console.error('Error fetching rounds:', err);
    res.status(500).json({ message: 'Failed to fetch rounds' });
  }
});

// Get list of bets
router.get('/bets', protect, admin, async (req, res) => {
  try {
    const bets = await Bet.find({});
    res.json(bets);
  } catch (err) {
    console.error('Error fetching bets:', err);
    res.status(500).json({ message: 'Failed to fetch bets' });
  }
});

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

    // Optional profitLoss reuse or empty summary here
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

// API Route: POST /api/admin/updateUserRole
// Allows admin to update a user's role based on email
router.post('/updateUserRole', protect, admin, async (req, res) => {
  try {
    const { email, newRole } = req.body;
    if (!email || !newRole) {
      return res.status(400).json({ error: 'Email and newRole are required' });
    }

    const validRoles = ['user', 'agent', 'admin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = newRole;
    await user.save();

    return res.json({ success: true, message: `User role updated to ${newRole}`, user });
  } catch (err) {
    console.error('UpdateUserRole error:', err);
    res.status(500).json({ error: 'Server error updating user role' });
  }
});

// Temporary route to fix role for users without admin middleware
router.post('/setRoleTemporary', protect, async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) return res.status(400).json({ error: 'Email and role required' });

    const validRoles = ['user', 'agent', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: `Role updated to ${role}`, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Recharge User Wallet
router.post('/recharge', protect, admin, async (req, res) => {
  try {
    const { email, amount, remark } = req.body;
    if (!email || !amount) return res.status(400).json({ message: 'Email and amount required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wallet = (user.wallet || 0) + Number(amount);
    await user.save();

    await RechargeLog.create({
      email,
      amount: Number(amount),
      date: new Date(),
      remark: remark || 'Admin Recharge'
    });

    res.json({ message: `Recharge successful`, wallet: user.wallet });
  } catch (err) {
    console.error('Admin recharge error:', err);
    res.status(500).json({ message: 'Recharge failed' });
  }
});

// Admin Redeem User Points
router.post('/redeem', protect, admin, async (req, res) => {
  try {
    const { email, points, remark } = req.body;
    if (!email || !points) return res.status(400).json({ message: 'Email and points required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if ((user.wallet || 0) < Number(points)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.wallet -= Number(points);
    await user.save();

    await RedeemLog.create({
      email,
      points: Number(points),
      date: new Date(),
      remark: remark || 'Admin Redeem'
    });

    res.json({ message: `Redeem successful`, wallet: user.wallet });
  } catch (err) {
    console.error('Admin redeem error:', err);
    res.status(500).json({ message: 'Redeem failed' });
  }
});

// Admin Get Recharge Logs
router.get('/rechargeLogs', protect, admin, async (req, res) => {
  try {
    const logs = await RechargeLog.find({}).sort({ date: -1 }).limit(100);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recharge logs' });
  }
});

// Admin Get Redeem Logs
router.get('/redeemLogs', protect, admin, async (req, res) => {
  try {
    const logs = await RedeemLog.find({}).sort({ date: -1 }).limit(100);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch redeem logs' });
  }
});

module.exports = router;
