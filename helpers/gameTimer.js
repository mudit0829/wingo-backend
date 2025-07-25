let intervalId = null;

const GameTimer = {
  start(callback, interval = 30000) {
    if (intervalId) {
      console.log('🛑 Timer already running.');
      return;
    }

    console.log(`⏳ Timer initialized with interval: ${interval}ms`);
    intervalId = setInterval(callback, interval);
    callback(); // Run once immediately
  },

  stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      console.log('🛑 Timer stopped');
    }
  },
};

module.exports = GameTimer;
