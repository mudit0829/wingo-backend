// routes/cronRoutes.js
const express = require("express");
const router = express.Router();
const Round = require("../models/Round");

// Route to manually generate a result
router.post("/generate", async (req, res) => {
  try {
    const resultOptions = ["Red", "Green", "Violet"];
    const randomIndex = Math.floor(Math.random() * resultOptions.length);
    const result = resultOptions[randomIndex];

    const newRound = new Round({
      result,
      timestamp: new Date()
    });

    await newRound.save();
    res.status(200).json({ message: "Result generated successfully", round: newRound });
  } catch (err) {
    console.error("Error generating result:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to start a 30s repeating timer for result generation
let timerRunning = false;
let interval;

router.post("/start-timer", (req, res) => {
  if (timerRunning) {
    return res.status(400).json({ message: "Timer already running" });
  }

  interval = setInterval(async () => {
    try {
      const resultOptions = ["Red", "Green", "Violet"];
      const randomIndex = Math.floor(Math.random() * resultOptions.length);
      const result = resultOptions[randomIndex];

      const newRound = new Round({
        result,
        timestamp: new Date()
      });

      await newRound.save();
      console.log("Auto-generated round:", newRound);
    } catch (err) {
      console.error("Timer error:", err);
    }
  }, 30000);

  timerRunning = true;
  res.status(200).json({ message: "Timer started" });
});

module.exports = router;
