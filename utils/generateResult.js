const Round = require('../models/round');
const Bet = require('../models/bet');
const User = require('../models/user');

function getColor(resultNumber) {
  if (resultNumber === 0 || resultNumber === 5) return 'Violet';
  if ([1, 3, 7, 9].includes(resultNumber)) return 'Green';
  if ([2, 4, 6, 8].includes(resultNumber)) return 'Red';
  return null;
}

async function generateResult(roundId) {
  try {
    const resultNumber = Math.floor(Math.random() * 10);
    const resultColor = getColor(resultNumber);

    const round = await Round.findOne({ roundId });
    if (!round) return console.error('❌ Round not found:', roundId);

    round.result = resultNumber;
    round.resultColor = resultColor;
    await round.save();

    const bets = await Bet.find({ roundId });
    const settledUsers = new Set();

    for (const bet of bets) {
      const effectiveAmount = bet.amount * 0.98;

      let payout = 0;

      // Color bet
      if (bet.color) {
        if (bet.color === 'Violet' && [0, 5].includes(resultNumber)) {
          payout += effectiveAmount * 4.5;
        } else if (
          bet.color === 'Green' && [1, 3, 7, 9].includes(resultNumber) ||
          bet.color === 'Red' && [2, 4, 6, 8].includes(resultNumber)
        ) {
          payout += effectiveAmount * 2;
        } else if (
          bet.color === 'Green' && resultNumber === 5 ||
          bet.color === 'Red' && resultNumber === 0
        ) {
          payout += effectiveAmount * 1.5;
        }
      }

      // Number bet
      if (typeof bet.number === 'number' && bet.number === resultNumber) {
        payout += effectiveAmount * 9;
      }

      // Update user's wallet
      if (payout > 0 && !settledUsers.has(bet.username)) {
        await User.updateOne({ username: bet.username }, { $inc: { wallet: payout } });
        settledUsers.add(bet.username);
      }
    }

    console.log(`🎯 Result for Round ${roundId}: Number ${resultNumber}, Color ${resultColor}`);
  } catch (err) {
    console.error('❌ Error generating result:', err.message);
  }
}

module.exports = generateResult;
