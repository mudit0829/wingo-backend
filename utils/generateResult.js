const Result = require('../models/Result');

function generateRandomResult(roundId) {
  const number = Math.floor(Math.random() * 10); // 0-9
  let color = 'GREEN';

  if (number === 0 || number === 5) {
    color = 'VIOLET';
  } else if (number % 2 === 0) {
    color = 'GREEN';
  } else {
    color = 'RED';
  }

  return new Result({
    roundId,
    number,
    color,
  });
}

module.exports = {
  generateRandomResult,
};
