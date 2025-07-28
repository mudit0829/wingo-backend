const express = require("express");
const router = express.Router();
const Bet = require("../models/bet");
const Round = require("../models/round");

// ✅ Place a new bet
router.post("/", async (req, res) => {
  try {
    const { username, roundId, color, number, amount } = req.body;

    if (!username || !roundId || !amount || (!color && number === undefined)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const round = await Round.findOne({ roundId });
    if (!round) {
      return res.status(404).json({ error: "Round not found" });
    }

    // Apply 2% service fee
    const effectiveAmount = amount * 0.98;

    const newBet = new Bet({
      username,
      roundId,
      timestamp: round.timestamp,
      amount,
      effectiveAmount,
    });

    if (color) newBet.color = color;
    if (number !== undefined) newBet.number = number;

    await newBet.save();
    res.status(201).json({ message: "Bet placed successfully", bet: newBet });
  } catch (error) {
    console.error("Error placing bet:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all bets (for admin/debug)
router.get("/", async (req, res) => {
  try {
    const bets = await Bet.find().sort({ createdAt: -1 });
    res.json(bets);
  } catch (err) {
    console.error("Error fetching bets:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get bets for a specific user
router.get("/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const bets = await Bet.find({ username }).sort({ createdAt: -1 });
    res.json(bets);
  } catch (err) {
    console.error("Error fetching user bets:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
