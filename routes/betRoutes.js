const express = require("express");
const Bet = require("../models/Bet");
const router = express.Router();

// POST /api/bets – place a bet
router.post("/", async (req, res) => {
  const { username, color, amount } = req.body;
  try {
    const bet = new Bet({ username, color, amount, status: "Pending" });
    await bet.save();
    res.json({ message: "Bet placed!", bet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bets/user/:username – retrieve bets for a user
router.get("/user/:username", async (req, res) => {
  try {
    const bets = await Bet.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json(bets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bets – get all bets (admin purpose)
router.get("/", async (req, res) => {
  try {
    const bets = await Bet.find().sort({ createdAt: -1 });
    res.json(bets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
