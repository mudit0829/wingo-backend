const express = require("express");
const router = express.Router();
const Bet = require("../models/Bet");
const User = require("../models/User");
const Round = require("../models/Round");

// Place Bet API
router.post("/", async (req, res) => {
  try {
    const { user, round, bets } = req.body;

    if (!user || !round || !Array.isArray(bets) || bets.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userData = await User.findOne({ email: user });
    const roundData = await Round.findOne({ roundId: round });
    if (!userData || !roundData) {
      return res.status(404).json({ message: "User or Round not found" });
    }

    let totalAmount = 0;
    const betDocs = [];

    for (const bet of bets) {
      if (!["color", "number"].includes(bet.type) || bet.value === undefined || bet.amount <= 0) {
        return res.status(400).json({ message: "Invalid bet format" });
      }

      const serviceFee = bet.amount * 0.02;
      const effectiveAmount = bet.amount - serviceFee;
      totalAmount += bet.amount;

      betDocs.push(
        new Bet({
          user: userData.email,
          round: roundData.roundId,
          type: bet.type,
          value: bet.value,
          amount: bet.amount,
          effectiveAmount: effectiveAmount,
          timestamp: new Date()
        })
      );
    }

    if (userData.wallet < totalAmount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    await Bet.insertMany(betDocs);
    userData.wallet -= totalAmount;
    await userData.save();

    res.status(201).json({ message: "Bet(s) placed successfully" });
  } catch (error) {
    console.error("Error placing bet:", error);
    res.status(500).json({ message: "Error placing bet", error });
  }
});

// Get All Bets
router.get("/", async (req, res) => {
  try {
    const bets = await Bet.find().sort({ timestamp: -1 });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bets", error });
  }
});

// Get Bets for a User
router.get("/user/:username", async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.params.username }).sort({ timestamp: -1 });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bets", error });
  }
});

module.exports = router;
