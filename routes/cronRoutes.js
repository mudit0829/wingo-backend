const express = require("express");
const router = express.Router();
const generateAndSaveResult = require("../utils/generateResult");

router.get("/generate-result", async (req, res) => {
  try {
    const result = await generateAndSaveResult();
    res.json({ message: "Result generated", result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
