const express = require("express");
const router = express.Router();
const Result = require("../models/Result");

router.get("/latest", async (req, res) => {
  try {
    const result = await Result.findOne().sort({ createdAt: -1 });
    if (!result) return res.status(404).json({ error: "No result found" });
    res.json(result);
  } catch (err) {
    console.error("Error fetching result:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
