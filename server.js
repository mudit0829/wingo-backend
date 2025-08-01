const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const betRoutes = require('./routes/betRoutes');
const roundRoutes = require('./routes/roundRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/rounds', roundRoutes);

// Start the game loop
const startGameLoop = require('./gameLoop');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(5000, () => {
      console.log('Server running on port 5000');
      startGameLoop(); // <== Start the game loop after server starts
    });
  })
  .catch(err => console.log(err));


