const express = require("express");
const router = express.Router();
const gameLoop = require("../gameLoop");
const generateResult = require("../utils/generateResult");

// Start game loop timer
router.post("/start-timer", (req, res) => {
  gameLoop.start();
  res.json({ message: "Timer started." });
});

// Manual result generation
router.post("/generate-result", async (req, res) => {
  try {
    const result = await generateResult();
    res.json({ message: "Result generated.", result });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate result." });
  }
});

module.exports = router;
