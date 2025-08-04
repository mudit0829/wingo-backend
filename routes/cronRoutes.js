const express = require('express');
const router = express.Router();
const Round = require('../models/round');
const Bet = require('../models/bet');
const User = require('../models/user');
const generateResult = require('../utils/generateResult');

// ✅ Auto Result Generation & Processing
router.get('/run', async (req, res) => {
  try {
    const latestRound = await Round.findOne().sort({ startTime: -1 });
    if (!latestRound) return res.status(404).json({ message: 'No active round found' });

    if (latestRound.resultNumber != null && latestRound.resultColor != null) {
      return res.status(200).json({ message: 'Result already generated for this round.' });
    }

    const result = await generateResult(latestRound.roundId);
    latestRound.resultNumber = result.number;
    latestRound.resultColor = result.color;
    await latestRound.save();

    await processBets(latestRound);

    res.status(200).json({ message: '✅ Auto Result generated successfully', result });
  } catch (error) {
    console.error('❌ Error in /run route:', error);
    res.status(500).json({ error: 'Failed to process round' });
  }
});

// ✅ Manual Result Control API (Admin)
router.post('/admin/setResult', async (req, res) => {
  try {
    const { roundId, resultColor, resultNumber } = req.body;

    if (!roundId || !resultColor || resultNumber === undefined) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const round = await Round.findOne({ roundId });
    if (!round) {
      return res.status(404).json({ message: 'Round not found' });
    }

    // Update Round Result
    round.resultColor = resultColor;
    round.resultNumber = resultNumber;
    await round.save();

    // Process Bets
    await processBets(round);

    console.log(`📝 Manual Result Set: Round ${roundId} | Color: ${resultColor} | Number: ${resultNumber}`);

    res.status(200).json({
      message: '✅ Manual Result set and bets processed successfully',
      roundId: round.roundId,
      resultColor: round.resultColor,
      resultNumber: round.resultNumber
    });

  } catch (error) {
    console.error('❌ Error in /admin/setResult route:', error);
    res.status(500).json({ message: 'Failed to set manual result' });
  }
});

// 🏆 Common Bet Processing Function
async function processBets(round) {
  const bets = await Bet.find({ roundId: round.roundId });
  if (!bets.length) {
    console.log(`🛑 No bets found for round ${round.roundId}`);
    return;
  }

  let winners = 0;
  let totalDistributed = 0;

  for (const bet of bets) {
    let winAmount = 0;
    const netAmount = bet.amount * 0.98; // Apply 2% service fee

    // Color Bet Logic
    if (bet.colorBet) {
      if (round.resultColor === 'Violet' && bet.colorBet === 'Violet') {
        winAmount += Math.floor(netAmount * 4.5);
      } else if (round.resultColor === bet.colorBet) {
        if (round.resultNumber === 0 || round.resultNumber === 5) {
          winAmount += Math.floor(netAmount * 1.5);
        } else {
          winAmount += Math.floor(netAmount * 2);
        }
      }
    }

    // Number Bet Logic
    if (bet.numberBet != null && bet.numberBet === round.resultNumber) {
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

  console.log(`🏆 Processed Round: ${round.roundId} | Total Bets: ${bets.length} | Winners: ${winners} | Distributed: ₹${totalDistributed}`);
}

module.exports = router;
