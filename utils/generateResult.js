const Bet = require('../models/bet');
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
      return null;
    }

    const roundId = activeRound.roundId;

    // 🔐 Prevent duplicate result generation
    const existing = await Result.findOne({ roundId });
    if (existing) {
      console.warn(`⚠️ Result already exists for round ${roundId}, skipping.`);
      return null;
    }

    const resultNumber = getRandomInt(10);
    const resultColor = calculateColor(resultNumber);

    const result = new Result({
      roundId,
      number: resultNumber,
      color: resultColor,
      timestamp: new Date()
    });

    await result.save();
    console.log(`🎯 Result for round ${roundId}: ${resultNumber} ${resultColor}`);

    return { resultNumber, resultColor };
  } catch (error) {
    console.error('❌ Error generating result:', error);
    return null;
  }
}

module.exports = generateResult;
