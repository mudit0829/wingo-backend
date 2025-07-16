require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Mongo connected ✅");

    const users = [
      {
        username: "admin",
        password: "admin123",
        role: "admin",
      },
      {
        username: "user",
        password: "user123",
        role: "user",
      },
    ];

    for (const user of users) {
      const existing = await User.findOne({ username: user.username });

      const hashedPassword = await bcrypt.hash(user.password, 10);

      if (existing) {
        existing.password = hashedPassword;
        existing.role = user.role;
        await existing.save();
        console.log(`✅ Updated user: ${user.username}`);
      } else {
        await User.create({ ...user, password: hashedPassword });
        console.log(`✅ Created user: ${user.username}`);
      }
    }

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Mongo error ❌", err);
  });
