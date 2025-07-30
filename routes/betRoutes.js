const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const Round = require('../models/round');
const User = require('../models/user');
const authenticate = require('../middleware/authenticate');

// POST /api/bets - Place a bet
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const { roundId, colorBet, numberBet, betAmount } = req.body;

    if (!roundId || !betAmount || (!colorBet && numberBet === undefined)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const round = await Round.findOne({ roundId });
    if (!round) return res.status(404).json({ message: 'Round not found' });

    const serviceFee = 0.02;
    const effectiveAmountPerBet = betAmount;
    let totalAmount = 0;

    if (colorBet) totalAmount += effectiveAmountPerBet;
    if (numberBet !== undefined) totalAmount += effectiveAmountPerBet;

    const fee = totalAmount * serviceFee;
    const totalDeduct = totalAmount + fee;

    if (user.wallet < totalDeduct) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    const newBet = new Bet({
      user: user.username,
      roundId,
      colorBet,
      numberBet,
      betAmount,
      timestamp: new Date()
    });

    await newBet.save();

    user.wallet -= totalDeduct;
    await user.save();

    res.status(201).json({ message: 'Bet placed successfully', wallet: user.wallet });
  } catch (err) {
    console.error('Error placing bet:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/bets/user/:username - Get user bets
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const bets = await Bet.find({ user: username }).sort({ timestamp: -1 }).limit(20);
    res.json(bets);
  } catch (err) {
    console.error('Error fetching user bets:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/bets - Get all bets (admin view)
router.get('/', async (req, res) => {
  try {
    const bets = await Bet.find().sort({ timestamp: -1 }).limit(100);
    res.json(bets);
  } catch (err) {
    console.error('Error fetching bets:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
