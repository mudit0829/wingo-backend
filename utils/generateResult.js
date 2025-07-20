const Round = require('../models/Round');
const Bet = require('../models/Bet');

function getRandomResult() {
  const rand = Math.random();
  if (rand < 0.45) return 'Red';
  if (rand < 0.9) return 'Green';
  return 'Violet';
}

async function generateGameResult() {
  try {
    const currentTime = new Date();

    const lastRound = await Round.findOne().sort({ roundId: -1 });

    const lastRoundId = lastRound ? lastRound.roundId : 1752590000000;
    const newRoundId = lastRoundId + 1;

    const result = getRandomResult();

    const round = new Round({
      roundId: newRoundId,
      result: result,
      timestamp: currentTime
    });

    await round.save();

    console.log(`✅ Round Generated - ID: ${newRoundId}, Result: ${result}`);

    return round;
  } catch (err) {
    console.error('❌ Error generating game result:', err);
    throw err;
  }
}

module.exports = generateGameResult;
