// routes/betRoutes.js
const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const User = require('../models/user');
const Round = require('../models/round');

// Place a bet
router.post('/', async (req, res) => {
  try {
    const { user, round, type, value, amount } = req.body;

    if (!user || !round || !type || !value || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const bet = new Bet({ user, round, type, value, amount });
    await bet.save();

    res.status(201).json({ message: 'Bet placed successfully', bet });
  } catch (error) {
    console.error('Error placing bet:', error);
    res.status(500).json({ message: 'Error placing bet', error });
  }
});

// Get all bets
router.get('/', async (req, res) => {
  try {
    const bets = await Bet.find().populate('user').populate('round');
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bets', error });
  }
});

// Get bets by user
router.get('/user/:userId', async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.params.userId }).populate('round');
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bets', error });
  }
});

module.exports = router;
