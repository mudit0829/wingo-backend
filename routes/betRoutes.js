// routes/betRoutes.js
const express = require('express');
const router = express.Router();
const Bet = require('../models/Bet');
const User = require('../models/User');

router.post('/', async (req, res) => {
  const { userId, roundId, type, value, amount } = req.body;
  const user = await User.findById(userId);
  if (!user || user.balance < amount) return res.status(400).json({ msg: 'Insufficient balance' });

  const serviceFee = amount * 0.02;
  const actual = amount - serviceFee;
  const bet = await Bet.create({ user: userId, roundId, type, value, amount: actual, serviceFee });

  user.balance -= amount;
  await user.save();

  res.json({ msg: 'Bet placed', bet });
});

module.exports = router;
