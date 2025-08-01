// gameLoop.js

const Round = require('./models/round');
const generateResult = require('./utils/generateResult');
const processBets = require('./utils/processBets');

async function runGameRound() {
  const round = new Round({
    roundId: Date.now().toString(),
    timestamp: new Date()
  });
  await round.save();

  setTimeout(async () => {
    const result = generateResult();
    round.result = result;
    await round.save();

    await processBets(round.roundId, result);
    console.log(`Processed round ${round.roundId} with result`, result);
  }, 25000); // Draw result after 25 seconds
}

function startGameLoop() {
  setInterval(runGameRound, 30000); // Run every 30 seconds
  runGameRound(); // Initial run immediately
}

module.exports = startGameLoop;
