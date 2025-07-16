const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, "secretkey", { expiresIn: "1h" });

    res.json({
      token,
      username: user.username,
      role: user.role
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});


// ✅ Temporary route to create default users
router.get("/create-default-users", async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ username: "admin" });
    const existingUser = await User.findOne({ username: "user" });

    if (!existingAdmin) {
      const admin = new User({
        username: "admin",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      });
      await admin.save();
    }

    if (!existingUser) {
      const user = new User({
        username: "user",
        password: await bcrypt.hash("user123", 10),
        role: "user",
      });
      await user.save();
    }

    res.send("✅ Default users created (admin/admin123 & user/user123)");
  } catch (err) {
    console.error("Error creating default users:", err);
    res.status(500).send("❌ Error creating default users");
  }
});

module.exports = router;
