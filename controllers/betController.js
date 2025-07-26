const asyncHandler = require('express-async-handler');
const Bet = require('../models/bet');
const Round = require('../models/round');
const User = require('../models/user');

const placeBet = asyncHandler(async (req, res) => {
  const { color, number, amount } = req.body;
  const userId = req.user._id;

  const round = await Round.findOne().sort({ roundNumber: -1 });
  if (!round) {
    res.status(400);
    throw new Error('No active round found');
  }

  const bet = new Bet({
    user: userId,
    round: round._id,
    color,
    number,
    amount,
  });

  await bet.save();

  // Deduct wallet amount from user (optional if wallet logic exists)
  await User.findByIdAndUpdate(userId, {
    $inc: { wallet: -Math.abs(amount) }
  });

  res.status(201).json({ message: 'Bet placed successfully', bet });
});

module.exports = { placeBet };
