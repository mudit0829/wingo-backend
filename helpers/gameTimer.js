const Round = require('../models/Round');
const generateResult = require('./generateResult');
const { startGameTimer } = require('../helpers/gameTimer');

let roundInterval;

const startGameLoop = () => {
  startGameTimer();
  roundInterval = setInterval(async () => {
    const newRound = new Round({
      timestamp: new Date()
    });
    await newRound.save();
    console.log(`New round started: ${newRound._id}`);
  }, 30000); // Every 30 seconds
};

module.exports = { startGameLoop };
