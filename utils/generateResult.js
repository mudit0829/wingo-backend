const Round = require('../models/Round');
const Bet = require('../models/Bet');

function getRandomResult() {
  const outcomes = ['Red', 'Green', 'Violet'];
  return outcomes[Math.floor(Math.random() * outcomes.length)];
}

async function generateResult() {
  const result = getRandomResult();
  const roundId = Date.now();
  const timestamp = new Date();

  const round = new Round({ roundId, result, timestamp });
  await round.save();

  // You can process bets here if needed
  return round;
}

module.exports = generateResult;
