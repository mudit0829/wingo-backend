const Round = require("../models/Round");

function getRandomColor() {
  const rand = Math.random();
  if (rand < 0.475) return "Red";
  else if (rand < 0.95) return "Green";
  else return "Violet";
}

async function generateResult() {
  const roundId = Math.floor(Date.now() / 1000);
  const result = getRandomColor();

  const newRound = new Round({
    roundId,
    result,
    timestamp: new Date(),
  });

  await newRound.save();
  console.log(`✅ Round ${roundId} result: ${result}`);
  return result;
}

module.exports = generateResult;
