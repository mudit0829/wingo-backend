const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Round = require('./models/round'); // Adjust path if needed

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');
        await Round.deleteMany({});
        console.log('All game rounds deleted.');
        mongoose.connection.close();
    })
    .catch(err => console.error('MongoDB connection error:', err));
