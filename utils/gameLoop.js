// utils/gameLoop.js

const Round = require('../models/round');
const generateResult = require('./generateResult');
const processBets = require('./processBets');

const startGameLoop = () => {
  setInterval(async () => {
    try {
      const newRound = new Round({
        timestamp: new Date(),
        roundId: Date.now().toString().slice(-6), // Just an example
      });

      const savedRound = await newRound.save();
      console.log(`New round created: ${savedRound.roundId}`);

      // Simulate draw delay
      setTimeout(async () => {
        const result = generateResult();
        savedRound.result = result;
        await savedRound.save();

        console.log(`Result for round ${savedRound.roundId}: ${result}`);
        await processBets(savedRound.roundId, result);
      }, 25000); // 25s for bets, then draw result
    } catch (err) {
      console.error('Game loop error:', err);
    }
  }, 30000); // Every 30 seconds
};

module.exports = { startGameLoop };
