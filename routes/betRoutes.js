const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const Round = require('../models/round');
const User = require('../models/user');

// PLACE A NEW BET
router.post('/', async (req, res) => {
  try {
    const { user, round, type, value, amount } = req.body;

    if (!user || !round || !type || !value || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ username: user });
    if (!existingUser) return res.status(404).json({ message: 'User not found' });

    const serviceFee = 0.02 * amount;
    const effectiveAmount = amount - serviceFee;

    const newBet = new Bet({
      user,
      round,
      type,
      value,
      amount,
      effectiveAmount,
      timestamp: new Date()
    });

    await newBet.save();
    res.status(201).json({ message: 'Bet placed successfully', bet: newBet });
  } catch (error) {
    console.error('Error placing bet:', error);
    res.status(500).json({ message: 'Error placing bet', error });
  }
});

// GET ALL BETS BY USERNAME
router.get('/user/:username', async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.params.username });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bets', error });
  }
});

// GET ALL BETS
router.get('/', async (req, res) => {
  try {
    const bets = await Bet.find();
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bets', error });
  }
});

module.exports = router;
