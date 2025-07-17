const express = require("express");
const router = express.Router();
const Bet = require("../models/Bet");

// Place a bet
router.post("/", async (req, res) => {
  try {
    const { username, amount, color, roundId } = req.body;
    const bet = new Bet({ username, amount, color, roundId });
    await bet.save();
    res.status(201).json({ message: "Bet placed", bet });
  } catch (err) {
    res.status(500).json({ message: "Error placing bet" });
  }
});

// Get all bets
router.get("/", async (req, res) => {
  try {
    const bets = await Bet.find().sort({ timestamp: -1 });
    res.json(bets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bets" });
  }
});

// Get bets by username
router.get("/user/:username", async (req, res) => {
  try {
    const bets = await Bet.find({ username: req.params.username }).sort({ timestamp: -1 });
    res.json(bets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user bets" });
  }
});

// 💡 NEW: Profit/Loss API
router.get("/profit/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const bets = await Bet.find({ username });

    let profit = 0;
    for (const bet of bets) {
      if (bet.status === "Win") {
        profit += bet.amount;
      } else if (bet.status === "Lose") {
        profit -= bet.amount;
      }
    }

    res.json({ username, profit });
  } catch (error) {
    console.error("Profit calculation error:", error);
    res.status(500).json({ message: "Failed to calculate profit." });
  }
});

module.exports = router;
