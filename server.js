const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load routes
const authRoutes = require('./routes/authRoutes');
const betRoutes = require('./routes/betRoutes');
const roundRoutes = require('./routes/roundRoutes');
const userRoutes = require('./routes/userRoutes');
const cronRoutes = require('./routes/cronRoutes');
const resetRoute = require('./routes/resetRoute');

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow only your frontend
const allowedOrigins = ['https://mudit0829.github.io'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cron', cronRoutes);
app.use('/api/reset', resetRoute);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);

    // ✅ Correct import of game loop
    const { startGameLoop } = require('./gameLoop');
    startGameLoop(); // ✅ Start WinGo game loop
  });

}).catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
});
