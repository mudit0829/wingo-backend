function getWinningColor(number) {
  if (number === 5) return "VIOLET";
  return [1,3,7,9].includes(number) ? "RED" : "GREEN";
}

module.exports = { getWinningColor };
