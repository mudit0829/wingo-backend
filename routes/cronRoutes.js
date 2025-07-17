const express = require("express");
const router = express.Router();
const Round = require("../models/Round");
const Bet = require("../models/Bet");

router.get("/run", async (req, res) => {
  try {
    const options = ["Red", "Green", "Violet"];
    const result = options[Math.floor(Math.random() * options.length)];

    const pendingRound = await Round.findOne({ result: null }).sort({ createdAt: -1 });

    if (!pendingRound) {
      const newRound = new Round({});
      await newRound.save();
      return res.status(200).json({ message: "New round created, no pending result." });
    }

    pendingRound.result = result;
    await pendingRound.save();

    const bets = await Bet.find({ roundId: pendingRound._id });

    for (const bet of bets) {
      bet.status = (bet.color === result) ? "Win" : "Lose";
      bet.profit = (bet.color === result) ? bet.amount * 2 : -bet.amount;
      await bet.save();
    }

    const nextRound = new Round({});
    await nextRound.save();

    res.status(200).json({ message: `Result ${result} updated`, roundId: pendingRound._id });
  } catch (err) {
    console.error("Cron error:", err);
    res.status(500).json({ error: "Error running cron" });
  }
});

module.exports = router;
