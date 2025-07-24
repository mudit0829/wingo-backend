let timerRunning = false;
let intervalId = null;

const startTimer = (callback) => {
  if (timerRunning) return;

  timerRunning = true;
  intervalId = setInterval(() => {
    callback();
  }, 30000); // 30 seconds
};

const stopTimer = () => {
  if (intervalId) clearInterval(intervalId);
  timerRunning = false;
};

module.exports = { startTimer, stopTimer };
