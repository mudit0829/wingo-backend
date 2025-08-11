const asyncHandler = require("express-async-handler");
const Bet = require("../models/bet");
const Round = require("../models/round");
const User = require("../models/user");

// PLACE A BET
const placeBet = asyncHandler(async (req, res) => {
  const { numberBet, colorBet, amount } = req.body;
  const email = req.user.email;  // logged-in user's email

  // Get active/latest round
  const round = await Round.findOne().sort({ createdAt: -1 });
  if (!round) throw new Error("No active round found");

  // Find user by email
  const user = await User.findOne({ email });
  if (!user || user.wallet < amount) throw new Error("Insufficient balance");

  // Calculate contract amount after fee
  const contractAmount = amount - 2;

  // Deduct wallet immediately
  user.wallet -= amount;
  await user.save();

  // Save bet with contractAmount
  const bet = new Bet({
    email,
    roundId: round._id,
    numberBet,
    colorBet,
    amount,
    contractAmount,
    win: null
  });
  await bet.save();

  res.status(201).json(bet);
});

// GET BET HISTORY for logged-in user
const getAllBets = asyncHandler(async (req, res) => {
  const bets = await Bet.find({ email: req.user.email })
    .populate("roundId")
    .sort({ createdAt: -1 });
  res.json(bets);
});

module.exports = { placeBet, getAllBets };
