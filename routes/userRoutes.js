const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Get wallet
router.get("/wallet/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update wallet
router.post("/update-wallet", async (req, res) => {
  try {
    const { username, amount } = req.body;

    if (!username || amount == null)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wallet += amount;
    await user.save();

    res.json({ message: "Wallet updated", wallet: user.wallet });
  } catch (error) {
    console.error("Wallet Update Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
