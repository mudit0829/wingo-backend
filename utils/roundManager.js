const axios = require("axios");

function startLoop() {
  setInterval(async () => {
    const r = await axios.post("http://localhost:3000/cron/start-timer");
    setTimeout(() => {
      axios.post("http://localhost:3000/cron/generate-result", { roundId: r.data.round.roundId });
    }, 30000);
  }, 30000);
}

module.exports = { startLoop };
