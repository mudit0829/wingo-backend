const Bet = require('../models/Bet');
const Round = require('../models/Round');

function generateColorFromSeed(seed) {
  const outcomes = ['Red', 'Green', 'Violet'];
  const index = seed % 10;

  if (index === 0 || index === 5) return 'Violet';
  if (index % 2 === 0) return 'Green';
  return 'Red';
}

async function generateResultForLastRound() {
  const lastRound = await Round.findOne().sort({ createdAt: -1 });

  if (!lastRound) throw new Error('No round found.');

  if (lastRound.result) return lastRound.result; // Skip if already has result

  const seed = lastRound.roundId;
  const result = generateColorFromSeed(seed);

  lastRound.result = result;
  await lastRound.save();

  // Optionally update bets, track winners here...

  return result;
}

module.exports = generateResultForLastRound;
