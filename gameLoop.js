const Round = require('./models/round');
const Bet = require('./models/bet');
const User = require('./models/user');
const generateResult = require('./utils/generateResult');
const processBets = require('./utils/processBets');

let isRunning = false;
let hasCleanedRounds = false;

async function cleanupRounds() {
  if (hasCleanedRounds) return;
  await Round.deleteMany({});
  console.log('🗑️ All old rounds cleaned up.');
  hasCleanedRounds = true;
}

async function startNewRound() {
  const now = new Date();
  const roundId = `R-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const newRound = new Round({ roundId, startTime: now });
  await newRound.save();
  console.log(`✅ New Round Started: ${roundId}`);
  return newRound;
}

async function endRound(round) {
  const result = await generateResult(round.roundId);
  if (!result) return;

  round.resultNumber = result.number;
  round.resultColor = result.color;
  round.endTime = new Date();
  await round.save();

  console.log(`🎯 Round Result: ${round.roundId} -> Number: ${result.number}, Color: ${result.color}`);

  await processBets(round.roundId, result);
}

function startGameLoop() {
  if (isRunning) return;
  isRunning = true;

  console.log('🔁 Starting Game Loop...');
  cleanupRounds();

  setInterval(async () => {
    try {
      const newRound = await startNewRound();
      await new Promise(resolve => setTimeout(resolve, 25000)); // betting window
      await endRound(newRound);
    } catch (err) {
      console.error('❌ Game Loop Error:', err);
    }
  }, 30000);
}

module.exports = { startGameLoop };
