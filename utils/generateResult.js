function generateResult() {
  const random = Math.floor(Math.random() * 100);
  if (random < 45) return "Green";
  if (random < 90) return "Red";
  return "Violet";
}

module.exports = generateResult;
