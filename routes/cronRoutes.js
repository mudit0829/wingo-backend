const express = require("express");
const router = express.Router();
const Round = require("../models/Round");
const Bet = require("../models/Bet");
const User = require("../models/User");
const { getWinningColor } = require("../utils/gameEngine");

router.post("/cron/generate-result", async (req, res) => {
  const { roundId } = req.body;
  const round = await Round.findOne({ roundId }).populate("bets");
  if (!round) return res.status(404).json({ msg: "Round not found" });

  const result = Math.floor(Math.random() * 10);
  const winningColor = getWinningColor(result);

  let totalPayout = 0, totalBet = 0;

  for (const bet of round.bets) {
    const user = await User.findById(bet.user);
    let win = false, payout = 0;

    if (bet.type === "color" && bet.value === winningColor) {
      win = true; payout = bet.amount * (winningColor === "VIOLET" ? 4.5 : 2);
    } else if (bet.type === "number" && Number(bet.value) === result) {
      win = true; payout = bet.amount * 9;
    }

    bet.status = win ? "WIN" : "LOSE";
    bet.winnings = win ? payout : 0;
    await bet.save();

    totalBet += bet.amount + bet.serviceFee;
    if (win) {
      totalPayout += payout;
      user.balance += payout;
      user.winHistory.push({ roundId, amountWon: payout });
      await user.save();
    }
  }

  round.result = result;
  round.winningColor = winningColor;
  round.profitLoss = totalBet - totalPayout;
  await round.save();

  res.json({ msg: "Result generated", round });
});

module.exports = router;
