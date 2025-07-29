// utils/roundManager.js
const Round = require("../models/round");

// Configurable round duration in milliseconds (30s round = 30000ms)
const ROUND_DURATION_MS = 30000;

let currentRound = null;

const createNewRound = async () => {
  try {
    const now = new Date();

    const round = new Round({
      timestamp: now,
    });

    const savedRound = await round.save();
    currentRound = savedRound;

    console.log("✅ New round created:", savedRound._id);
    return savedRound;
  } catch (err) {
    console.error("❌ Error creating round:", err);
  }
};

const getCurrentRound = () => {
  return currentRound;
};

// Auto-start the round timer
const startRoundTimer = async () => {
  await createNewRound(); // Create initial round immediately

  setInterval(async () => {
    await createNewRound();
  }, ROUND_DURATION_MS);
};

module.exports = {
  createNewRound,
  getCurrentRound,
  startRoundTimer,
};
