const axios = require("axios");

function startLoop() {
  setInterval(async () => {
    try {
      const r = await axios.post("http://localhost:3000/cron/start-timer");
      console.log('[📦] Round started:', r.data);

      setTimeout(() => {
        axios.post("http://localhost:3000/cron/generate-result", {
          roundId: r.data.round.roundId
        }).then(res => {
          console.log('[🎯] Result generated:', res.data);
        }).catch(err => {
          console.error('[❌] Error generating result:', err.message);
        });
      }, 25000); // wait 25 seconds for betting
    } catch (err) {
      console.error('[❌] Error starting round:', err.message);
    }
  }, 30000); // every 30s
}

module.exports = { startLoop };
