const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const Bet = require("../models/bet");
const Round = require("../models/round");

// Place a bet
router.post("/", authenticate, async (req, res) => {
  try {
    const { roundId, amount, type, value } = req.body;

    if (!roundId || !amount || !type || !value) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const bet = new Bet({
      user: req.user._id,
      round: roundId,
      amount,
      type,
      value,
    });

    await bet.save();
    res.status(201).json(bet);
  } catch (error) {
    console.error("Error placing bet:", error);
    res.status(500).json({ error: "Failed to place bet" });
  }
});

// ✅ NEW: Get user's bet history
router.get("/history", authenticate, async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("round");

    res.json(bets);
  } catch (err) {
    console.error("Error fetching bet history:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
