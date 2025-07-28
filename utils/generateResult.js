const Result = require('../models/Result');

// Get color based on number
function getColor(number) {
  if ([1, 3, 7, 9].includes(number)) return 'GREEN';
  if ([2, 4, 6, 8].includes(number)) return 'RED';
  if ([0, 5].includes(number)) return 'VIOLET';
  return 'UNKNOWN';
}

// Generate random result and store it in the Result collection
const generateRandomResult = (roundId) => {
  const resultNumber = Math.floor(Math.random() * 10); // 0–9
  const resultColor = getColor(resultNumber);

  const result = new Result({
    roundId: roundId.toString(),
    resultNumber,
    resultColor,
    timestamp: new Date(),
  });

  console.log(`[🎯] Generated result: ${resultNumber} (${resultColor}) for Round ${roundId}`);

  return result;
};

module.exports = { generateRandomResult };
