const express = require("express");
const router = express.Router();
const Bet = require("../models/Bet");

router.post("/", async (req, res) => {
  try {
    const { username, color } = req.body;

    if (!username || !color) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const bet = new Bet({ username, color });
    await bet.save();
    res.json({ message: "Bet placed", bet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  const bets = await Bet.find().sort({ roundTime: -1 }).limit(10);
  res.json(bets);
});

module.exports = router;
