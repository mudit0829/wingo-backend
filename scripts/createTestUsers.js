const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.deleteMany({});
  const hashedAdminPass = await bcrypt.hash("admin123", 10);
  const hashedUserPass = await bcrypt.hash("user123", 10);

  await User.insertMany([
    { email: "admin@example.com", password: hashedAdminPass, role: "admin" },
    { email: "user@example.com", password: hashedUserPass, role: "user" }
  ]);

  console.log("✅ Test users created");
  process.exit();
}).catch(err => console.error(err));
