const express = require("express");
const Round = require("../models/Round");

const router = express.Router();

// Generate random color result (Red, Green, Violet)
function getRandomResult() {
  const options = ["Red", "Green", "Violet"];
  return options[Math.floor(Math.random() * options.length)];
}

router.post("/generate", async (req, res) => {
  try {
    const result = getRandomResult();

    const newRound = new Round({
      result,
      createdAt: new Date(),
    });

    await newRound.save();
    res.status(201).json({ message: "Round result generated", result });
  } catch (err) {
    res.status(500).json({ message: "Error generating result", error: err });
  }
});

module.exports = router;
