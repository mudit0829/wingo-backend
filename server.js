const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const cronRoutes = require('./routes/cronRoutes');
const dotenv = require('dotenv');
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());

app.get('/ping', (req, res) => res.send('pong'));
app.get('/api/health', (req, res) => res.send('API is running 🚀'));
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/cron', cronRoutes);

app.listen(process.env.PORT || 5000, () => console.log('Server started'));
