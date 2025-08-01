const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { startGameLoop } = require('./gameLoop'); // ✅ Import game loop

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
app.use('/api/cron', require('./routes/cronRoutes')); // ✅ manually trigger game loop
app.use('/api/reset', require('./routes/resetRoute'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));
app.use('/api/result', require('./routes/resultRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ Start automatic game loop every 30 seconds
setInterval(() => {
  startGameLoop();
}, 30000);
