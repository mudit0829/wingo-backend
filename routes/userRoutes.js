const express = require("express");
const router = express.Router();
const User = require("../models/user");

// GET wallet balance by email
router.get("/wallet/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ email: user.email, balance: user.balance });
  } catch (error) {
    console.error("GET /wallet/:email error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST to update wallet
router.post("/update-wallet", async (req, res) => {
  try {
    const { email, amount } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.balance += amount;
    await user.save();
    res.json({ message: "Wallet updated", balance: user.balance });
  } catch (error) {
    console.error("POST /update-wallet error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET full user data by email
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("GET /user/:email error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
