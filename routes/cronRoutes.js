// routes/cronRoutes.js
const express = require("express");
const router = express.Router();
const Round = require("../models/Round");
const generateResult = require("../utils/generateResult");

// Generate result manually (admin)
router.post("/generate-result", async (req, res) => {
  try {
    const result = await generateResult(); // function returns { roundId, result }
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("Generate Result Error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
