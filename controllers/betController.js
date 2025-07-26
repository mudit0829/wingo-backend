const asyncHandler = require("express-async-handler");
const Bet = require("../models/bet");
const Round = require("../models/round");
const User = require("../models/user");

// PLACE A BET
const placeBet = asyncHandler(async (req, res) => {
  const { number, color, amount } = req.body;
  const userId = req.user._id;

  const round = await Round.findOne().sort({ createdAt: -1 });

  if (!round) throw new Error("No active round");

  const user = await User.findById(userId);
  if (!user || user.wallet < amount) throw new Error("Insufficient balance");

  const bet = new Bet({ user: userId, round: round._id, number, color, amount });
  await bet.save();

  user.wallet -= amount;
  await user.save();

  res.status(201).json(bet);
});

// GET ALL BETS (for history)
const getAllBets = asyncHandler(async (req, res) => {
  const bets = await Bet.find({ user: req.user._id }).populate("round").sort({ createdAt: -1 });
  res.json(bets);
});

module.exports = { placeBet, getAllBets };
