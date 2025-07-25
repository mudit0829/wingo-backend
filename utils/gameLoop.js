const Round = require('../models/Round');
const Result = require('../models/Result');
const Bet = require('../models/Bet');
const User = require('../models/user');
const GameTimer = require('../helpers/gameTimer');
const { generateRandomResult } = require('./generateResult');
const processBets = require('./processBets');

let timerRunning = false;

const startTimer = () => {
  if (timerRunning) {
    console.log('[⏱] Timer is already running');
    return;
  }

  console.log('[⏱] Starting game timer...');
  timerRunning = true;

  GameTimer.start(async () => {
    console.log('[⏳] Game loop triggered');

    try {
      console.log('[🌀] Creating new round...');
      const round = await createNewRound();
      console.log(`[📦] New Round ID: ${round._id}`);

      const result = generateRandomResult(round._id);
      console.log(`[🎯] Generated result: ${result.result}`);
      await result.save();
      console.log('[💾] Result saved to DB');

      await processBets(round._id, result.result);
      console.log('[💸] Bets processed successfully');

    } catch (err) {
      console.error('[❌] Error inside game loop:', err);
    }
  }, 30000);
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
  await processBets(roundId, result.result);
  return result;
};

module.exports = {
  startTimer,
  generateResult,
};
