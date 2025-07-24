const express = require("express");
const router = express.Router();
const Round = require("../models/Round");

router.post("/cron/start-timer", async (req, res) => {
  const roundId = Date.now().toString();
  const round = await Round.create({ roundId, startTime: new Date(), endTime: new Date(Date.now() + 30000) });
  res.json({ msg: "New round started", round });
});

module.exports = router;
