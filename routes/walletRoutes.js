// routes/walletRoutes.js
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const User = require("../models/User");

router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ balance: user.wallet });
  } catch (error) {
    console.error("Wallet fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
