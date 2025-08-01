const Round = require('./models/round');
const generateResult = require('./utils/generateResult');

// Starts a new round every 30 seconds
async function startGameLoop() {
  try {
    const now = new Date();

    // Generate a unique roundId based on date/time
    const roundId = `R-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    // Create the round in the DB
    const newRound = new Round({
      roundId,
      timestamp: now
    });

    await newRound.save();

    console.log(`✅ New round started: ${roundId}`);

    // Wait 25s for bets, then generate result
    setTimeout(() => {
      generateResult(roundId);
    }, 25000); // 25 seconds
  } catch (err) {
    console.error('❌ Error in startGameLoop:', err.message);
  }
}

module.exports = { startGameLoop };
