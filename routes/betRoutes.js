const express = require("express");
const router = express.Router();
const Bet = require("../models/Bet");
const Round = require("../models/Round");

// Place a new bet
router.post("/", async (req, res) => {
  try {
    const { username, color, amount, roundId } = req.body;

    const round = await Round.findOne({ roundId });
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    const newBet = new Bet({
      username,
      color,
      amount,
      roundId,
      roundTime: round.startTime,
      status: "Pending",
      resultColor: null,
    });

    await newBet.save();
    res.status(201).json({ message: "Bet placed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bets - for admin
router.get("/", async (req, res) => {
  try {
    const bets = await Bet.find().sort({ createdAt: -1 });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update result of round and user bet status
router.post("/set-result", async (req, res) => {
  try {
    const { roundId, result } = req.body;

    // Update round result
    const round = await Round.findOneAndUpdate(
      { roundId },
      { result },
      { new: true }
    );

    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    // Update user bets
    const bets = await Bet.find({ roundId });

    for (let bet of bets) {
      bet.resultColor = result;
      bet.status = bet.color === result ? "Won" : "Lost";
      await bet.save();
    }

    res.json({ message: "Result updated and bets settled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profit/loss
router.get("/user-stats/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const bets = await Bet.find({ username });

    let profit = 0;
    for (let bet of bets) {
      if (bet.status === "Won") {
        profit += bet.amount * 2;
      } else if (bet.status === "Lost") {
        profit -= bet.amount;
      }
    }

    res.json({ username, profit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
