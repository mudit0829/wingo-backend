const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const betRoutes = require('./routes/betRoutes');
const roundRoutes = require('./routes/roundRoutes');
const userRoutes = require('./routes/userRoutes');
const cronRoutes = require('./routes/cronRoutes');
const adminResetRoute = require('./routes/adminResetRoute');
const adminRoutes = require('./routes/adminRoutes');
const shoppingIntegrationRoutes = require('./routes/shoppingIntegrationRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins (update with your domains)
const allowedOrigins = [
  'https://mudit0829.github.io',
  'http://wingogames.in',
  'https://wingogames.in',
  'http://www.wingogames.in',
  'https://www.wingogames.in'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cron', cronRoutes);
app.use('/api/reset', adminResetRoute);
app.use('/api/admin', adminRoutes);

// Shopping integration APIs
app.use('/api/shopping', shoppingIntegrationRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('✅ WinGo Backend is running');
});

// MongoDB Connection & Game Loop Start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);

    const { startGameLoop } = require('./gameLoop');
    startGameLoop();
  });

}).catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
});
