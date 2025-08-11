const Round = require('./models/round');
const generateResult = require('./utils/generateResult');
const processBets = require('./utils/processBets');

let isRunning = false;
let hasCleanedRounds = false;

async function cleanupRounds() {
  if (hasCleanedRounds) return;
  try {
    await Round.deleteMany({});
    console.log('🗑️ All old rounds cleaned up.');
    hasCleanedRounds = true;
  } catch (err) {
    console.error('❌ Error cleaning old rounds:', err);
  }
}

async function startNewRound() {
  try {
    const now = new Date();
    const roundId = `R-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    
    const newRound = new Round({ roundId, startTime: now });
    await newRound.save();

    console.log(`✅ New Round Started: ${roundId}`);
    return newRound;
  } catch (err) {
    console.error('❌ Failed to start new round:', err);
    return null;
  }
}

async function endRound(round) {
  if (!round) {
    console.warn('⚠️ No round to end.');
    return;
  }
  try {
    const result = await generateResult(round.roundId);
    if (!result) {
      console.warn(`⚠️ No result generated for round ${round.roundId}`);
      return;
    }

    round.resultNumber = result.number;
    round.resultColor = result.color;
    round.endTime = new Date();
    await round.save();

    console.log(`🎯 Round Result: ${round.roundId} -> Number: ${result.number}, Color: ${result.color}`);

    // Process bets and credit winners
    await processBets(round.roundId, result);
  } catch (err) {
    console.error(`❌ Error ending round ${round?.roundId}:`, err);
  }
}

async function startGameLoop() {
  if (isRunning) return;
  isRunning = true;

  console.log('🔁 Starting Game Loop...');
  await cleanupRounds();

  setInterval(async () => {
    try {
      const newRound = await startNewRound();

      console.log('⏳ Betting window open (25s)...');
      await new Promise(resolve => setTimeout(resolve, 25000));

      await endRound(newRound);
    } catch (err) {
      console.error('❌ Game Loop Error:', err);
    }
  }, 30000);
}

module.exports = { startGameLoop };
