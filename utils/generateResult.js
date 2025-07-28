const Result = require('../models/Result');
const Round = require('../models/Round');

// Get color based on number
function getColor(number) {
  if ([1, 3, 7, 9].includes(number)) return 'GREEN';
  if ([2, 4, 6, 8].includes(number)) return 'RED';
  if ([0, 5].includes(number)) return 'VIOLET';
  return 'UNKNOWN';
}

// Generate and save result in DB
const generateAndSaveResult = async () => {
  try {
    // Get the latest round
    const latestRound = await Round.findOne().sort({ createdAt: -1 });

    if (!latestRound) {
      throw new Error('No round found to generate result for');
    }

    const roundId = latestRound.roundId;
    const resultNumber = Math.floor(Math.random() * 10); // 0–9
    const resultColor = getColor(resultNumber);

    const newResult = new Result({
      roundId: roundId.toString(),
      resultNumber,
      resultColor,
      timestamp: new Date()
    });

    await newResult.save();

    console.log(`[🎯] Saved Result: ${resultNumber} (${resultColor}) for Round ${roundId}`);
    return newResult;
  } catch (err) {
    console.error('[❌] Failed to generate result:', err.message);
    throw err;
  }
};

module.exports = generateAndSaveResult;
