const Round = require('../models/Round');
const Bet = require('../models/Bet');

function getRandomResult() {
  const outcomes = ['RED', 'GREEN', 'VIOLET'];
  return outcomes[Math.floor(Math.random() * outcomes.length)];
}

async function generateAndSaveResult() {
  const round = await Round.findOne({ result: { $exists: false } }).sort({ createdAt: 1 });

  if (!round) {
    throw new Error('No round or result already generated');
  }

  const result = getRandomResult();
  round.result = result;
  await round.save();

  return round;
}

module.exports = generateAndSaveResult;
