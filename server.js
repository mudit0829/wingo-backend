const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { startGameLoop } = require('./utils/gameLoop');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bets', require('./routes/betRoutes'));
app.use('/api/rounds', require('./routes/roundRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/cron', require('./routes/cronRoutes'));
app.use('/api/result', require('./routes/resultRoutes'));

// DB connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  startGameLoop();
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
