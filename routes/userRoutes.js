const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Bet = require('../models/bet');
const Round = require('../models/round');
const { protect } = require('../middleware/authenticate');

// Get wallet for logged-in user, include redeem history if exists
router.get('/wallet', protect, async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ 
      wallet: user.wallet,
      redeemHistory: user.redeemHistory || []
    });
  } catch (err) {
    console.error('Fetch Wallet Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update wallet (admin only - add protect & role check middleware)
router.post('/wallet/update', async (req, res) => {
  try {
    const { email, amount } = req.body;
    if (!email || typeof amount !== 'number') {
      return res.status(400).json({ message: 'Email and numeric amount are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wallet += amount;
    await user.save();

    res.json({ message: 'Wallet updated successfully', wallet: user.wallet });
  } catch (err) {
    console.error('Update Wallet Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Profit/Loss Calculation
router.get('/profit-loss', async (req, res) => {
  try {
    const bets = await Bet.find().lean();
    const roundIds = [...new Set(bets.map(b => b.roundId))];
    const rounds = await Round.find({ roundId: { $in: roundIds } }).lean();
    const roundMap = Object.fromEntries(rounds.map(r => [r.roundId, r]));

    let totalBets = 0, totalDistributed = 0, totalServiceFee = 0;

    bets.forEach(bet => {
      const round = roundMap[bet.roundId];
      const resultNumber = round ? round.resultNumber : null;

      const serviceFee = bet.amount - (bet.contractAmount ?? bet.amount);
      totalBets += bet.amount;
      totalServiceFee += serviceFee;

      if (bet.win === true && bet.contractAmount != null) {
        let winAmount = 0;

        if (bet.colorBet) {
          if (bet.colorBet === 'Red' && [2, 4, 6, 8, 0].includes(resultNumber))
            winAmount += bet.contractAmount * 2;
          if (bet.colorBet === 'Green' && [1, 3, 7, 9, 5].includes(resultNumber))
            winAmount += bet.contractAmount * 2;
          if (bet.colorBet === 'Violet' && [0, 5].includes(resultNumber))
            winAmount += bet.contractAmount * 4.5;
        }
        if (bet.numberBet != null && bet.numberBet === resultNumber) {
          winAmount += bet.contractAmount * 9;
        }

        totalDistributed += winAmount;
      }
    });

    const profit = totalBets - totalDistributed;

    res.json({ totalBets, totalDistributed, totalServiceFee, profit });
  } catch (err) {
    console.error('Profit/Loss Error:', err);
    res.status(500).json({ message: 'Failed to calculate profit/loss' });
  }
});

// Redeem points for user (protected)
router.post('/redeem', protect, async (req, res) => {
  try {
    const email = req.user.email;
    const redeemPoints = Number(req.body.points);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Initialize new fields if not yet present
    user.initialRecharge = user.initialRecharge || 0;
    user.totalLostFromRecharge = user.totalLostFromRecharge || 0;
    user.wallet = user.wallet || 0;
    user.redeemHistory = user.redeemHistory || [];

    const protectedBase = user.initialRecharge - user.totalLostFromRecharge;
    const redeemable = user.wallet - protectedBase > 0 ? user.wallet - protectedBase : 0;

    if (redeemPoints <= 0 || redeemPoints > redeemable) {
      return res.status(400).json({ error: 'Redeem amount invalid! Only winnings above protected recharge base can be redeemed.' });
    }

    // Deduct redeem amount and log
    user.wallet -= redeemPoints;
    user.redeemHistory.unshift({
      date: new Date(),
      points: redeemPoints,
    });

    await user.save();

    res.json({
      success: true,
      redeemed: redeemPoints,
      wallet: user.wallet,
      redeemableLeft: user.wallet - protectedBase > 0 ? user.wallet - protectedBase : 0,
      redeemHistory: user.redeemHistory
    });
  } catch (err) {
    console.error('Redeem Error:', err);
    res.status(500).json({ error: 'Server error during redeem.' });
  }
});

// Get user profile info (name, email, wallet, role)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (only name for now)
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    // Add other fields here if needed

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
