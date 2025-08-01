// generateResult.js

const Bet = require('../models/bet'); // <-- case-sensitive fix
const Round = require('../models/round');
const Result = require('../models/result');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function calculateColor(resultNumber) {
  if (resultNumber === 5 || resultNumber === 0) return 'Violet';
  if ([1, 3, 7, 9].includes(resultNumber)) return 'Green';
  if ([2, 4, 6, 8].includes(resultNumber)) return 'Red';
  return null;
}

async function generateResult(activeRound) {
  try {
    if (!activeRound || !activeRound.roundId) {
      console.warn('⚠️ Cannot generate result: Invalid active round.');
      return;
    }

    const roundId = activeRound.roundId;
    const resultNumber = getRandomInt(10);
    const resultColor = calculateColor(resultNumber);

    const result = new Result({
      roundId: roundId,
      number: resultNumber,
      color: resultColor,
      timestamp: new Date()
    });

    await result.save();
    console.log(`🎯 Result for round ${roundId}: ${resultNumber} ${resultColor}`);

    await processBets(roundId, resultNumber, resultColor);

    return { resultNumber, resultColor };
  } catch (error) {
    console.error('❌ Error generating result:', error);
  }
}

async function processBets(roundId, resultNumber, resultColor) {
  const bets = await Bet.find({ roundId });

  for (const bet of bets) {
    if (!bet.colorBet && !bet.numberBet) {
      console.warn(`⚠️ Skipping invalid bet: ${bet._id}`);
      continue;
    }

    let winAmount = 0;
    const feePercent = 0.02;

    // Color bet evaluation
    if (bet.colorBet) {
      const actualColorBet = bet.color;
      const effectiveAmount = bet.colorBet * (1 - feePercent);

      if (actualColorBet === 'Violet' && (resultNumber === 0 || resultNumber === 5)) {
        winAmount += effectiveAmount * 4.5;
      } else if (actualColorBet === 'Red' && [2, 4, 6, 8].includes(resultNumber)) {
        winAmount += effectiveAmount * 2;
      } else if (actualColorBet === 'Green' && [1, 3, 7, 9].includes(resultNumber)) {
        winAmount += effectiveAmount * 2;
      } else if (
        (actualColorBet === 'Green' && resultNumber === 5) ||
        (actualColorBet === 'Red' && resultNumber === 0)
      ) {
        winAmount += effectiveAmount * 1.5;
      }
    }

    // Number bet evaluation
    if (bet.numberBet !== null && bet.numberBet !== undefined) {
      const effectiveAmount = bet.numberBet * (1 - feePercent);
      if (resultNumber === bet.numberBetValue) {
        winAmount += effectiveAmount * 9;
      }
    }

    if (winAmount > 0) {
      console.log(`💰 User ${bet.username} won Rs.${Math.round(winAmount)} in round ${roundId}`);
    }
  }
}

module.exports = generateResult;
