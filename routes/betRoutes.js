const express = require("express");
const router = express.Router();
const Bet = require("../models/Bet");

// Place a new bet
router.post("/", async (req, res) => {
  const { username, color, amount, roundId } = req.body;

  try {
    const roundTime = new Date(); // or fetch from rounds DB if needed
    const bet = new Bet({ username, color, amount, roundId, roundTime });
    await bet.save();
    res.json({ message: "Bet placed successfully", bet });
  } catch (err) {
    res.status(500).json({ message: "Error placing bet" });
  }
});

// Get all bets of a specific user (limit to last 10)
router.get("/:username", async (req, res) => {
  try {
    const bets = await Bet.find({ username: req.params.username })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(bets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bet history" });
  }
});

module.exports = router;
