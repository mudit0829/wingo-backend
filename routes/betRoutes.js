const express = require("express");
const router = express.Router();
const Bet = require("../models/Bet");

router.post("/", async (req, res) => {
  const { username, color, amount, roundId } = req.body;
  if (!username || !color || !amount || !roundId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const bet = new Bet({ username, color, amount, roundId });
    await bet.save();
    res.json({ message: "Bet placed", bet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error placing bet." });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const bets = await Bet.find({ username: req.params.username }).sort({ createdAt: -1 }).limit(10);
    res.json(bets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bets." });
  }
});

module.exports = router;
