require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createSuperadmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected ✔️");

    const email = process.env.MAIN_SUPERADMIN_EMAIL;
    const password = process.env.MAIN_SUPERADMIN_PASSWORD;

    if (!email || !password) {
      console.log("❌ Set MAIN_SUPERADMIN_EMAIL and MAIN_SUPERADMIN_PASSWORD in .env");
      process.exit(1);
    }

    let existing = await User.findOne({ email });

    if (existing) {
      console.log("⚠ Superadmin already exists:", email);
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: "Main Superadmin",
      email,
      passwordHash: hash,
      role: "superadmin",
    });

    console.log("✅ Superadmin created successfully:");
    console.log("Email:", user.email);
    console.log("Password:", password);
    process.exit(0);

  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
}

createSuperadmin();
