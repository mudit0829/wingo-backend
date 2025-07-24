const Round = require('../models/Round');
const Result = require('../models/Result');
const Bet = require('../models/Bet');
const User = require('../models/User');
const GameTimer = require('../helpers/gameTimer');
const { generateRandomResult } = require('./generateResult');
const processBets = require('./processBets');

let timerRunning = false;

const startTimer = () => {
  if (timerRunning) return;

  timerRunning = true;
  GameTimer.start(async () => {
    const round = await createNewRound();
    const result = generateRandomResult(round._id);
    await result.save();
    await processBets(round._id, result);
  }, 30000); // Every 30 seconds
};

const createNewRound = async () => {
  const round = new Round({
    startTime: new Date(),
    status: 'open',
  });
  return await round.save();
};

const generateResult = async (roundId) => {
  const result = generateRandomResult(roundId);
  await result.save();
  await processBets(roundId, result);
  return result;
};

module.exports = {
  startTimer,
  generateResult,
};
