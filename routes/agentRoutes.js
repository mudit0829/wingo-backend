const express = require('express');
const router = express.Router();
const User = require('../models/user');
const RechargeLog = require('../models/rechargeLog');

// Middleware: protect agent endpoints (Use your existing auth middleware)
const authenticateAgent = require('../middleware/authenticateShoppingJWT');

// Get all referred users
router.get('/referred-users', authenticateAgent, async (req, res) => {
  try {
    // Only allow agent users
    if (req.user.role !== 'agent') {
      return res.status(403).json({ error: 'Forbidden: not agent' });
    }

    // Find users who registered with this agent's ID
    const users = await User.find({ agentId: req.user._id }, 'name email wallet');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get agent commission summary and history
router.get('/salary', authenticateAgent, async (req, res) => {
  try {
    // Only allow agent users
    if (req.user.role !== 'agent') {
      return res.status(403).json({ error: 'Forbidden: not agent' });
    }

    // Total salary
    const totalSalary = req.user.salaryEarned || 0;

    // Get commission history (from RechargeLogs where user's agentId is agent)
    const referredUsers = await User.find({ agentId: req.user._id });
    const referredUserIds = referredUsers.map(u => u._id);

    const logs = await RechargeLog.find({
      userId: { $in: referredUserIds }
    }).sort({ date: -1 });

    // Build a detail/history array for the frontend salary page
    const history = await Promise.all(logs.map(async log => {
      const user = await User.findById(log.userId);
      return {
        detail: 'Recharge Commission',
        user: user?.name || user?.email || 'User',
        time: log.date,
        commission: (log.amount * 0.10).toFixed(2),
        amount: log.amount
      };
    }));

    res.json({
      totalSalary: totalSalary,
      salaryHistory: history
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
