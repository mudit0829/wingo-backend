const express = require("express");
const router = express.Router();
const Result = require("../models/Result");

// GET all results
router.get("/", async (req, res) => {
  try {
    const results = await Result.find().sort({ roundNumber: -1 }).limit(10);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
