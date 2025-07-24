const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

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

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => console.log('Server running'));
}).catch(err => console.error(err));