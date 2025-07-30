const express = require('express');
const router = express.Router();
const Bet = require('../models/Bet');
const Round = require('../models/Round');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

// POST /api/bets
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const { roundId, colorBet, numberBet, betAmount } = req.body;

    if (!roundId || !betAmount || (!colorBet && !numberBet)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const serviceFee = 0.02;
    const totalBetAmount = betAmount * ((colorBet && numberBet) ? 2 : 1);
    const feeDeductedAmount = totalBetAmount + (totalBetAmount * serviceFee);

    if (user.wallet < feeDeductedAmount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    const newBet = new Bet({
      user: user.username,
      roundId,
      colorBet,
      numberBet,
      betAmount,
      timestamp: new Date(),
    });

    await newBet.save();

    // Deduct wallet balance
    user.wallet -= feeDeductedAmount;
    await user.save();

    res.status(201).json({ message: 'Bet placed successfully', wallet: user.wallet });
  } catch (err) {
    console.error('Error placing bet:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
