// utils/generateResult.js
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function calculateColor(resultNumber) {
  if (resultNumber === 0 || resultNumber === 5) return 'Violet';
  if ([1, 3, 7, 9].includes(resultNumber)) return 'Green';
  if ([2, 4, 6, 8].includes(resultNumber)) return 'Red';
  return null;
}

async function generateResult(roundId) {
  try {
    const resultNumber = getRandomInt(10); // 0-9
    const resultColor = calculateColor(resultNumber);
    console.log(`🎯 Result Generated: ${roundId} -> ${resultNumber} ${resultColor}`);
    return { number: resultNumber, color: resultColor };
  } catch (error) {
    console.error('❌ Error generating result:', error);
    return null;
  }
}

module.exports = generateResult;
