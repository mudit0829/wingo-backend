const express = require("express");
const router = express.Router();
const Round = require("../models/Round");

router.get("/", async (req, res) => {
  try {
    const rounds = await Round.find().sort({ startTime: -1 }).limit(10);
    res.json(rounds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching rounds." });
  }
});

module.exports = router;
