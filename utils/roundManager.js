// utils/roundManager.js
const Round = require("../models/round");
const generateResult = require("./generateResult");
const processBets = require("./processBets");

const DURATIONS = {
  WIN30: 30000,
  WIN1: 60000,
  WIN3: 180000,
  WIN5: 300000
};

async function createNewRound(gameType) {
  try {
    const now = new Date();
    const roundId = `${gameType}-${now.toISOString().slice(0,19).replace(/[-T:]/g,"")}`;

    const result = await generateResult(roundId);

    const round = new Round({
      gameType,
      roundId,
      startTime: now,
      resultNumber: result.number,
      resultColor: result.color
    });

    const savedRound = await round.save();
    console.log(`✅ [${gameType}] New Round: ${savedRound.roundId} -> ${savedRound.resultNumber} (${savedRound.resultColor})`);

    await processBets(savedRound);
  } catch (err) {
    console.error(`❌ Error creating ${gameType} round:`, err);
  }
}

function startRoundTimers() {
  Object.entries(DURATIONS).forEach(([gameType, ms]) => {
    createNewRound(gameType); // Start first immediately
    setInterval(() => createNewRound(gameType), ms);
  });
}

module.exports = { startRoundTimers };
