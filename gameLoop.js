const Round = require("./models/Round");

// Utility to randomly return "Red", "Green", or "Violet"
function generateResult() {
  const choices = ["Red", "Green", "Violet"];
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

async function endLastRound() {
  const lastRound = await Round.findOne({ result: null }).sort({ startTime: -1 });

  if (!lastRound) return;

  const result = generateResult();
  lastRound.result = result;
  await lastRound.save();

  console.log(`🎯 Round ${lastRound.roundId} ended. Result: ${result}`);
}

async function createNewRound() {
  await endLastRound(); // Close previous round before starting a new one

  const now = new Date();
  const endTime = new Date(now.getTime() + 30000); // 30 sec round

  const round = new Round({
    roundId: Date.now().toString(),
    startTime: now,
    endTime,
    result: null
  });

  await round.save();
  console.log("🕑 New round created:", round.roundId);
}

function startGameLoop() {
  createNewRound(); // Start immediately
  setInterval(createNewRound, 30000); // Every 30 sec
}

module.exports = { startGameLoop };
