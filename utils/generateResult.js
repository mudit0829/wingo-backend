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

async function generateResult(roundId) {
  try {
    const existing = await Result.findOne({ roundId });
    if (existing) {
      console.warn(`⚠️ Result already exists for round ${roundId}, skipping.`);
      return existing;
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
    console.log(`🎯 Result Generated: ${roundId} -> ${resultNumber} ${resultColor}`);

    return result;
  } catch (error) {
    console.error('❌ Error generating result:', error);
    return null;
  }
}

module.exports = generateResult;
