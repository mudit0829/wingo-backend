const express = require("express");
const router = express.Router();
const Round = require("../models/Round");
const generateResult = require("../utils/generateResult");

// Route to generate result manually (admin)
router.post("/generate-result", async (req, res) => {
  try {
    const lastRound = await Round.findOne().sort({ timestamp: -1 });

    const newRoundId = Date.now(); // Unique round ID
    const result = generateResult();
    const timestamp = new Date();

    const newRound = new Round({
      roundId: newRoundId,
      result,
      timestamp,
    });

    await newRound.save();

    res.status(200).json({ message: "Result generated", round: newRound });
  } catch (error) {
    console.error("Error generating result:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
