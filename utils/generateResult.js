const Round = require('../models/round');
const Bet = require('../models/bet');
const User = require('../models/user');
const Result = require('../models/result');

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
    if (!round) {
      console.error('❌ Round not found:', roundId);
      return;
    }

    round.result = resultNumber;
    round.resultColor = resultColor;
    await round.save();

    const bets = await Bet.find({ roundId });

    const settledUsers = new Set();

    for (const bet of bets) {
      // If any required field is missing in existing bet (should not happen), skip it
      if (!bet.amount || !bet.email || typeof bet.roundId === 'undefined') {
        console.warn('⚠️ Skipping invalid bet:', bet);
        continue;
      }

      const effectiveAmount = bet.amount * 0.98;
      let payout = 0;
      let isWin = false;

      // Color bet logic
      if (bet.color) {
        if (bet.color === 'Violet' && [0, 5].includes(resultNumber)) {
          payout += effectiveAmount * 4.5;
          isWin = true;
        } else if (
          (bet.color === 'Green' && [1, 3, 7, 9].includes(resultNumber)) ||
          (bet.color === 'Red' && [2, 4, 6, 8].includes(resultNumber))
        ) {
          payout += effectiveAmount * 2;
          isWin = true;
        } else if (
          (bet.color === 'Green' && resultNumber === 5) ||
          (bet.color === 'Red' && resultNumber === 0)
        ) {
          payout += effectiveAmount * 1.5;
          isWin = true;
        }
      }

      // Number bet logic
      if (typeof bet.number === 'number' && bet.number === resultNumber) {
        payout += effectiveAmount * 9;
        isWin = true;
      }

      bet.isWin = isWin;
      bet.payout = payout;

      // Save only if bet is valid
      await bet.save();

      if (payout > 0 && !settledUsers.has(bet.email)) {
        await User.updateOne({ email: bet.email }, { $inc: { wallet: payout } });
        settledUsers.add(bet.email);
      }
    }

    await new Result({
      roundId,
      number: resultNumber,
      color: resultColor,
      timestamp: round.timestamp,
    }).save();

    console.log(`✅ Round ${roundId} - Result: ${resultNumber} (${resultColor})`);
  } catch (err) {
    console.error('❌ Error generating result:', err);
  }
}

module.exports = generateResult;
