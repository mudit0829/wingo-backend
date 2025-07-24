// utils/gameEngine.js
function getWinningColor(num) {
  if (num === 5) return 'VIOLET';
  return [1,3,7,9].includes(num) ? 'RED' : 'GREEN';
}
module.exports = { getWinningColor };
