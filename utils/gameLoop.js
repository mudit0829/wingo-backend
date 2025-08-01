const Round = require('../models/round');
const Result = require('../models/result');
const GameTimer = require('../helpers/gameTimer');
const { getColor } = require('./generateResult'); // Assume getColor is exported
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
      // Step 1: Create new round
      const round = await createNewRound();
      console.log(`[🆕] Round created: ${round._id}`);

      // Step 2: Generate result
      const resultNumber = Math.floor(Math.random() * 10); // 0–9
      const resultColor = getColor(resultNumber);

      const result = new Result({
        roundId: round._id,
        resultNumber,
        resultColor,
        timestamp: new Date()
      });

      await result.save();
      console.log(`[🎯] Result saved: ${resultNumber} (${resultColor})`);

      // Step 3: Process bets & update wallet
      await processBets(round._id, resultNumber, resultColor);
      console.log('[💸] Bets processed & wallets updated.');

      // Step 4: Close current round
      await Round.findByIdAndUpdate(round._id, { status: 'closed' });

    } catch (err) {
      console.error('[❌] Error in game loop:', err);
    }
  }, 30000); // every 30 seconds
};

const createNewRound = async () => {
  const round = new Round({
    startTime: new Date(),
    status: 'open'
  });
  return await round.save();
};

module.exports = {
  startTimer,
};
