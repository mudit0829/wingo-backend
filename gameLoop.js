const Round = require("./models/Round");

async function createNewRound() {
  const now = new Date();
  const endTime = new Date(now.getTime() + 30000); // 30 seconds from now

  const round = new Round({
    roundId: Date.now().toString(),
    startTime: now,
    endTime
  });

  await round.save();
  console.log("🕑 New round created:", round.roundId);
}

function startGameLoop() {
  createNewRound(); // create first immediately
  setInterval(createNewRound, 30000); // every 30s
}

module.exports = { startGameLoop };
