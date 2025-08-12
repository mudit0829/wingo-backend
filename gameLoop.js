const Round = require('./models/round');
const generateResult = require('./utils/generateResult');
const processBets = require('./utils/processBets');

// durations per game type
const GAME_DURATIONS = {
  WIN30: 30000,
  WIN1: 60000,
  WIN3: 180000,
  WIN5: 300000
};

// Only clean OLD completed rounds, do not delete active ones
async function cleanupOldRounds() {
  try {
    const deleted = await Round.deleteMany({ endTime: { $exists: true } });
    console.log(`🗑️ Cleaned ${deleted.deletedCount} old completed rounds`);
  } catch (err) {
    console.error('❌ Error cleaning old rounds:', err);
  }
}

async function startNewRound(gameType) {
  try {
    const now = new Date();
    // ✅ Include milliseconds for uniqueness
    const roundId = `${gameType}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(
      2,
      '0'
    )}${String(now.getSeconds()).padStart(2, '0')}${String(now.getMilliseconds()).padStart(3, '0')}`;

    const newRound = new Round({ gameType, roundId, startTime: now });
    await newRound.save();
    console.log(`✅ [${gameType}] New Round Started: ${roundId}`);
    return newRound;
  } catch (err) {
    console.error(`❌ Failed to start new ${gameType} round:`, err);
    return null;
  }
}

async function endRound(round) {
  if (!round) return console.warn('⚠️ No round to end.');
  try {
    const result = await generateResult(round.roundId);
    if (!result) {
      console.warn(`⚠️ No result generated for ${round.roundId}`);
      return;
    }

    round.resultNumber = result.number;
    round.resultColor = result.color;
    round.endTime = new Date();
    await round.save();

    console.log(`🎯 [${round.gameType}] Result: ${round.roundId} -> Num: ${result.number}, Color: ${result.color}`);

    // Pass the whole round so processBets can filter by gameType
    await processBets(round);
  } catch (err) {
    console.error(`❌ Error ending round ${round.roundId}:`, err);
  }
}

function startGameLoop() {
  console.log('🔁 Starting Multi‑Game Loop...');
  cleanupOldRounds();

  // Start each game type with a slight delay so they don't share the same second
  Object.entries(GAME_DURATIONS).forEach(([gameType, duration], index) => {
    setTimeout(() => {
      (async () => {
        let currentRound = await startNewRound(gameType);

        setInterval(async () => {
          console.log(`⏳ [${gameType}] Betting window open for ${(duration / 1000) - 5}s`);
          await new Promise(res => setTimeout(res, duration - 5000));

          await endRound(currentRound);
          currentRound = await startNewRound(gameType);
        }, duration);
      })();
    }, index * 2000); // stagger: each loop starts 2 secs after previous
  });
}

module.exports = { startGameLoop };
