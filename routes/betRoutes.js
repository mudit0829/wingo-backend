const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const User = require('../models/user');

// POST place bet
router.post('/', async (req, res) => {
  const { email, roundId, colorBet, numberBet, amount } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    const serviceFee = amount * 0.02;
    const finalAmount = amount - serviceFee;

    const bet = new Bet({
      email,
      roundId,
      colorBet,
      numberBet,
      amount: finalAmount,
      timestamp: new Date()
    });

    await bet.save();
    user.balance -= amount;
    await user.save();

    res.json({ message: 'Bet placed successfully', bet });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET user bets by email
router.get('/user/:email', async (req, res) => {
  try {
    const bets = await Bet.find({ email: req.params.email });
    res.json(bets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
