const express = require("express");
const router = express.Router();
const Round = require("../models/Round");
const generateResult = require("../utils/generateResult");

// Start Game Timer (simulate 30-second interval - in real case use cron)
router.post("/start", async (req, res) => {
  res.json({ message: "Timer started (mock)" });
});

// Generate a result for a new round
router.post("/generate-result", async (req, res) => {
  try {
    const result = generateResult(); // e.g., "Red", "Green", "Violet"
    const timestamp = new Date();

    const lastRound = await Round.findOne().sort({ roundId: -1 });
    const roundId = lastRound ? lastRound.roundId + 1 : 1;

    const newRound = new Round({ roundId, result, timestamp });
    await newRound.save();

    res.status(201).json({ message: "Result generated", newRound });
  } catch (error) {
    console.error("Error generating result:", error);
    res.status(500).json({ error: "Failed to generate result" });
  }
});

module.exports = router;
