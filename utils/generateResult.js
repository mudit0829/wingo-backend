const Round = require('../models/round');
const processBets = require('./processBets');

const generateResult = async () => {
  const pendingRound = await Round.findOne({ result: null }).sort({ createdAt: 1 });

  if (!pendingRound) return;

  const result = Math.floor(Math.random() * 10);
  pendingRound.result = result;
  await pendingRound.save();

  await processBets(pendingRound.roundId, result);
};

module.exports = generateResult;
