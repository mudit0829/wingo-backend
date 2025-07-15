// One-time route to create test users
router.get("/create-test-users", async (req, res) => {
  try {
    await User.deleteMany({});
    await User.insertMany([
      { username: "admin", password: "admin123", role: "admin" },
      { username: "user", password: "user123", role: "user" }
    ]);
    res.send("✅ Test users created");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error creating users");
  }
});
