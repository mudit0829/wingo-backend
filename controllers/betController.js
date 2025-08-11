const asyncHandler = require("express-async-handler");
const Bet = require("../models/bet");
const Round = require("../models/round");
const User = require("../models/user");

// PLACE A BET — login required
const placeBet = asyncHandler(async (req, res) => {
  const { numberBet, colorBet, amount } = req.body;
  const email = req.user.email; // always from logged-in user

  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }

  // Find latest active round
  const round = await Round.findOne().sort({ createdAt: -1 });
  if (!round) throw new Error("No active round found");

  // Enforce 25-second betting window
  const secondsSinceStart =
    (Date.now() - new Date(round.startTime).getTime()) / 1000;
  if (secondsSinceStart > 25) {
    return res.status(400).json({ message: "Betting closed for this round" });
  }

  const user = await User.findOne({ email });
  if (!user || user.wallet < amount)
    throw new Error("Insufficient balance");

  const contractAmount = amount - 2; // fixed fee

  // Deduct wallet immediately
  user.wallet -= amount;
  await user.save();

  // Save bet
  const bet = new Bet({
    email,
    roundId: round.roundId,
    numberBet: numberBet ?? null,
    colorBet: colorBet ?? null,
    amount,
    contractAmount,
    win: null
  });

  await bet.save();

  res.status(201).json({
    message: "Bet placed successfully",
    bet,
    newWalletBalance: user.wallet
  });
});

// GET ALL BETS for current user (history with round results)
const getAllBets =
