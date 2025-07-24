const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const { startNewRound } = require('./roundManager');
const generateAndSaveResult = require('./utils/generateResult');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const betRoutes = require('./routes/betRoutes');
const roundRoutes = require('./routes/roundRoutes');
const cronRoutes = require('./routes/cronRoutes');
const resetRoute = require('./routes/resetRoute');

app.use('/api/auth', authRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/cron', cronRoutes);
app.use('/api/reset', resetRoute);

// DB + Server
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // Start the first round manually at server start
    startNewRound();

    // Run game loop every 30 seconds (25s place bet, 5s draw)
    cron.schedule('*/30 * * * * *', async () => {
        try {
            await generateAndSaveResult(); // Close current round and generate result
            await startNewRound();         // Start next round
        } catch (error) {
            console.error('Game loop error:', error.message);
        }
    });

}).catch(err => console.error('DB connection error:', err));
