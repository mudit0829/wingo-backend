const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const { email, roundId, color, number, amount } = req.body;

    if (!email || !roundId || !amount) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const serviceFee = 0.02 * amount;
    const finalAmount = amount - serviceFee;

    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const newBet = new Bet({
      email,
      roundId,
      color,
      number,
      amount,
      effectiveAmount: finalAmount,
      timestamp: new Date()
    });

    user.balance -= amount;
    await user.save();
    await newBet.save();

    res.json({ message: 'Bet placed', bet: newBet, remainingBalance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
