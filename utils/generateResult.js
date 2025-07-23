const Round = require('../models/Round');

function getRandomResult() {
  const outcomes = ['RED', 'GREEN', 'VIOLET'];
  return outcomes[Math.floor(Math.random() * outcomes.length)];
}

async function generateAndSaveResult() {
  // ✅ Find the latest round with result not yet set (null or undefined)
  const round = await Round.findOne({
    $or: [{ result: { $exists: false } }, { result: null }]
  }).sort({ createdAt: -1 }); // latest round

  if (!round) {
    throw new Error('No round or result already generated');
  }

  const result = getRandomResult();
  round.result = result;
  await round.save();

  return round;
}

module.exports = generateAndSaveResult;
