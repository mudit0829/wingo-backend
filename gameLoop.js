const generateResult = require("./utils/generateResult");

let interval;

function start() {
  if (interval) return;

  interval = setInterval(async () => {
    console.log("⏱️ Running scheduled result generation...");
    await generateResult();
  }, 30000); // 30 seconds
}

function stop() {
  clearInterval(interval);
  interval = null;
}

module.exports = { start, stop };
