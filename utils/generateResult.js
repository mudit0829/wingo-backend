function generateResult() {
  const result = Math.floor(Math.random() * 10); // 0 to 9
  return result.toString(); // Ensure result is a string
}

module.exports = generateResult;
