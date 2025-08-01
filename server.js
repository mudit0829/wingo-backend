const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const { startGameLoop } = require('./utils/gameLoop'); // ✅ fixed import
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/bets', require('./routes/betRoutes'));
app.use('/api/rounds', require('./routes/roundRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cron', require('./routes/cronRoutes'));
app.use('/api/reset', require('./routes/resetRoute'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));
app.use('/api/result', require('./routes/resultRoutes'));

// Schedule game loop to run every 30 seconds
cron.schedule('*/30 * * * * *', () => {
  console.log('⏳ Running game loop at', new Date().toLocaleTimeString());
  startGameLoop(); // ✅ call the named export
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
