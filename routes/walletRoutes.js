const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate"); // ✅ your file
const User = require("../models/user");

router.get("/", authenticate, async (req, res) => {
  try {
    const user = req.user; // set by your middleware
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ balance: user.balance });
  } catch (error) {
    console.error("Wallet fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
