const express = require('express');
const router = express.Router();
const Round = require('../models/round');
const Bet = require('../models/bet');
const User = require('../models/user');
const generateResult = require('../utils/generateResult');

// Manual Result Generation & Processing
router.get('/run', async (req, res) => {
  try {
    const latestRound = await Round.findOne().sort({ startTime: -1 });
    if (!latestRound) return res.status(404).json({ message: 'No active round found' });

    // Skip if result already generated
    if (latestRound.resultNumber != null && latestRound.resultColor != null) {
      return res.status(200).json({ message: 'Result already generated for this round.' });
    }

    // Generate Result
    const result = await generateResult(latestRound.roundId);

    // Save Result in Round DB
    latestRound.resultNumber = result.number;
    latestRound.resultColor = result.color;
    await latestRound.save();

    console.log(`🎯 Round Result: ${latestRound.roundId} -> Number: ${result.number}, Color: ${result.color}`);

    // Process Bets
    const bets = await Bet.find({ roundId: latestRound.roundId });
    if (!bets.length) {
      console.log(`🛑 No bets placed for round ${latestRound.roundId}`);
      return res.status(200).json({ message: 'No bets placed for this round.' });
    }

    let winners = 0;
    let totalDistributed = 0;

    for (const bet of bets) {
      let winAmount = 0;
      const netAmount = bet.amount * 0.98; // Apply 2% service fee

      // Color Bet Logic
      if (bet.colorBet) {
        if (result.color === 'Violet' && bet.colorBet === 'Violet') {
          winAmount += Math.floor(netAmount * 4.5);
        } else if (result.color === bet.colorBet) {
          if (result.number === 0 || result.number === 5) {
            winAmount += Math.floor(netAmount * 1.5);
          } else {
            winAmount += Math.floor(netAmount * 2);
          }
        }
      }

      // Number Bet Logic
      if (bet.numberBet != null && bet.numberBet === result.number) {
        winAmount += Math.floor(netAmount * 9);
      }

      if (winAmount > 0) {
        const user = await User.findOne({ email: bet.email });
        if (user) {
          user.wallet += winAmount;
          await user.save();
        }
        bet.win = true;
        winners++;
        totalDistributed += winAmount;
      } else {
        bet.win = false;
      }

      await bet.save();
    }

    console.log(`🏆 Round Summary: ${latestRound.roundId} | Total Bets: ${bets.length} | Winners: ${winners} | Distributed: ₹${totalDistributed}`);

    res.status(200).json({
      message: '✅ Result generated and processed successfully',
      roundId: latestRound.roundId,
      resultNumber: result.number,
      resultColor: result.color,
      totalBets: bets.length,
      winners,
      totalDistributed
    });
  } catch (error) {
    console.error('❌ Error in /run route:', error);
    res.status(500).json({ error: 'Failed to process round' });
  }
});

module.exports = router;
