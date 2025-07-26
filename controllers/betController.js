const Bet = require("../models/Bet");
const User = require("../models/user");

exports.placeBet = async (req, res) => {
  try {
    const { amount, type, value } = req.body;
    const user = req.user;

    if (user.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const bet = new Bet({
      user: user._id,
      round: Date.now().toString(), // Replace with actual round logic
      type, // "color" or "number"
      value, // e.g., "RED" or "5"
      amount,
    });

    await bet.save();

    user.balance -= amount;
    await user.save();

    res.json({ message: "Bet placed", bet });
  } catch (err) {
    console.error("Error placing bet:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
