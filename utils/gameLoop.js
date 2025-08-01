const Round = require('../models/round');
const generateResult = require('../utils/generateResult');

let currentRound = null;
let roundCounter = 1;
const ROUND_DURATION = 30 * 1000; // 30 seconds
const BETTING_TIME = 25 * 1000;   // 25 seconds

const startNewRound = async () => {
  const timestamp = new Date();
  const roundId = `R${Date.now()}`;

  currentRound = new Round({ roundId, timestamp });
  await currentRound.save();
  roundCounter++;
};

const gameLoop = async () => {
  await startNewRound();

  setTimeout(async () => {
    await generateResult();
    setTimeout(gameLoop, 5000); // Wait 5s after result, then start next round
  }, BETTING_TIME);
};

module.exports = gameLoop;
