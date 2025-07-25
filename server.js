const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const cronRoutes = require('./routes/cronRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ✅ Enable CORS for all origins (or limit it to your frontend domain)
app.use(cors({
  origin: '*', // change to 'https://your-frontend-url.com' when live
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/cron', cronRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
