const express = require('express');
const router = express.Router();
const Round = require('../models/round');
const Bet = require('../models/bet');
const generateResult = require('../utils/generateResult');

// Manually trigger a result generation and save it to DB
router.get('/run', async (req, res) => {
  try {
    // Get the latest round
    const latestRound = await Round.findOne().sort({ startTime: -1 });
    if (!latestRound) return res.status(404).json({ message: 'No active round found' });

    // Generate result
    const result = await generateResult(latestRound.roundId);

    // Save the result directly (do not recalculate color here)
    latestRound.resultNumber = result.number;
    latestRound.resultColor = result.color;
    await latestRound.save();

    console.log(`🎯 Round Result: ${latestRound.roundId} -> Number: ${result.number}, Color: ${result.color}`);

    // Process Bets (example logic, adjust as needed)
    const bets = await Bet.find({ roundId: latestRound.roundId });
    let winners = 0;
    let totalDistributed = 0;

    for (const bet of bets) {
      let won = false;

      // Check Color Bet
      if (bet.colorBet === result.color) {
        won = true;
        const payout = result.color === 'Violet' ? bet.netAmount * 4.5 : bet.netAmount * 2;
        totalDistributed += payout;
      }

      // Check Number Bet
      if (bet.numberBet != null && bet.numberBet === result.number) {
        won = true;
        const payout = bet.netAmount * 9;
        totalDistributed += payout;
      }

      if (won) winners += 1;

      bet.win = won;
      await bet.save();
    }

    console.log(`🏆 Round Summary: ${latestRound.roundId} | Total Bets: ${bets.length} | Winners: ${winners} | Distributed: ₹${totalDistributed}`);

    res.status(200).json({
      message: '✅ Result generated and saved successfully',
      roundId: latestRound.roundId,
      resultNumber: result.number,
      resultColor: result.color,
      totalBets: bets.length,
      winners,
      totalDistributed
    });
  } catch (error) {
    console.error('❌ Error in /run route:', error);
    res.status(500).json({ error: 'Failed to run game loop' });
  }
});

module.exports = router;
