const express = require("express");
const Bet = require("../models/Bet");
const router = express.Router();

// ✅ 1. Place a new bet
router.post("/", async (req, res) => {
  try {
    const { username, color, amount } = req.body;
    const bet = new Bet({ username, color, amount, status: "Pending" });
    await bet.save();
    res.json({ message: "Bet placed!", bet });
  } catch (err) {
    res.status(500).json({ message: "Server error placing bet" });
  }
});

// ✅ 2. Get bets for a specific user (fix: clear route path)
router.get("/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const bets = await Bet.find({ username });
    res.json(bets);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching user bets" });
  }
});

// ✅ 3. Get all bets (admin)
router.get("/", async (req, res) => {
  try {
    const bets = await Bet.find();
    res.json(bets);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching all bets" });
  }
});

module.exports = router;
