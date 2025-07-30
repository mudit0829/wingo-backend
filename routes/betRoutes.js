const express = require("express");
const router = express.Router();
const Bet = require("../models/bet");
const User = require("../models/user");
const Round = require("../models/round");

// Place a bet
router.post("/", async (req, res) => {
  try {
    const { email, colorBet, numberBet, roundId, amount } = req.body;

    // Check if user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if round exists
    const round = await Round.findOne({ roundId });
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    // Deduct amount from wallet
    const serviceFee = amount * 0.02;
    const netAmount = amount - serviceFee;

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance -= amount;
    await user.save();

    const newBet = new Bet({
      email,
      colorBet,
      numberBet,
      roundId,
      timestamp: new Date(),
      amount: netAmount,
    });

    await newBet.save();
    res.status(201).json({ message: "Bet placed successfully", newBet });
  } catch (error) {
    console.error("POST /api/bets error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
