// utils/generateResult.js
const Round = require("../models/Round");

function getRandomResult() {
  const rand = Math.floor(Math.random() * 100);
  if (rand < 45) return "Red";
  if (rand < 90) return "Green";
  return "Violet";
}

module.exports = async function generateResult() {
  const result = getRandomResult();
  const roundId = Date.now(); // Use UNIX timestamp
  const newRound = new Round({
    roundId,
    result,
    timestamp: new Date()
  });

  await newRound.save();
  return { roundId, result };
};
