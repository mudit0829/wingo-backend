const express = require('express');
const Bet = require('../models/bet');
const User = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, roundId, colorBet, numberBet, amount } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const totalBetAmount = amount;
    if (user.balance < totalBetAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const newBet = new Bet({ email, roundId, colorBet, numberBet, amount });
    await newBet.save();

    user.balance -= totalBetAmount;
    await user.save();

    res.status(201).json({ message: 'Bet placed', balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/:email', async (req, res) => {
  try {
    const bets = await Bet.find({ email: req.params.email });
    res.json(bets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bets' });
  }
});

module.exports = router;
