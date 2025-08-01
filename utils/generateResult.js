// utils/generateResult.js

function generateResult() {
  const number = Math.floor(Math.random() * 10);

  let color = '';
  if (number === 0 || number === 5) {
    color = 'Violet';
  } else if ([1, 3, 7, 9].includes(number)) {
    color = 'Green';
  } else {
    color = 'Red';
  }

  return { number, color };
}

module.exports = generateResult;
