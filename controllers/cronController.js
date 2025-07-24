const startGame = require('../helpers/gameTimer');

const startGameTimer = (req, res) => {
  startGame(); // Start the 30-second round cycle
  res.send('Game timer started');
};

module.exports = startGameTimer;
