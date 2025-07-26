const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wallet: { type: Number, default: 1000 },  // <-- renamed from balance to wallet
});

module.exports = mongoose.model("User", userSchema);
