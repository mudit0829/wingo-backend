const express = require("express");
const router = express.Router();
const { generateResult } = require("../cron/generateResult");

router.post("/generate", async (req, res) => {
  try {
    const result = await generateResult();
    res.status(200).json({ message: "Result generated", data: result });
  } catch (err) {
    console.error("❌ API Error generating result:", err.message);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

module.exports = router;
