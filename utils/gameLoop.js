const Round = require('../models/round');
const Result = require('../models/Result');
const GameTimer = require('../helpers/gameTimer');
const { generateRandomResult } = require('./generateResult');
const processBets = require('./processBets');

let timerRunning = false;

const startTimer = () => {
  if (timerRunning) {
    console.log('[⏱] Timer already running.');
    return;
  }

  console.log('[🟢] Game timer started.');
  timerRunning = true;

  GameTimer.start(async () => {
    console.log('[🔁] Game loop triggered.');

    try {
      const round = await createNewRound();
      console.log(`[🆕] Round created: ${round._id}`);

      const resultData = generateRandomResult(round._id);
      const result = new Result({
        roundId: round._id,
        result: resultData,
        timestamp: new Date()
      });

      await result.save();
      console.log(`[🎯] Result generated and saved: ${resultData}`);

      await processBets(round._id, resultData);
      console.log('[💸] Bets processed.');

    } catch (err) {
      console.error('[❌] Error in game loop:', err);
    }
  }, 30000); // 30 seconds
};

const createNewRound = async () => {
  const round = new Round({
    startTime: new Date(),
    status: 'open'
  });
  return await round.save();
};

const generateResult = async (roundId) => {
  const resultData = generateRandomResult(roundId);
  const result = new Result({
    roundId,
    result: resultData,
    timestamp: new Date()
  });

  await result.save();
  await processBets(roundId, resultData);
  return result;
};

module.exports = {
  startTimer,
  generateResult,
};
