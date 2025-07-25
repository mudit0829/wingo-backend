const Result = require('../models/Result');

function getColor(number) {
  if ([1, 3, 7, 9].includes(number)) return 'RED';
  if ([2, 4, 6, 8].includes(number)) return 'GREEN';
  return 'VIOLET';
}

const generateRandomResult = (roundId) => {
  const resultNumber = Math.floor(Math.random() * 10); // 0–9
  const resultColor = getColor(resultNumber);

  const result = new Result({
    roundId: roundId.toString(), // ✅ convert ObjectId to string
    resultNumber,
    resultColor,
  });

  console.log(`[🎯] Generated result: ${resultNumber} (${resultColor})`);

  return result;
};

module.exports = { generateRandomResult };
