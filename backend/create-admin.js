// backend/create-admin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const email = process.env.MAIN_ADMIN_EMAIL;
    const password = process.env.MAIN_ADMIN_PASSWORD;
    const role = process.env.MAIN_ADMIN_ROLE || "superadmin";  // DEFAULT SUPERADMIN

    if (!email || !password) {
      console.error("❌ MAIN_ADMIN_EMAIL or MAIN_ADMIN_PASSWORD missing in .env");
      process.exit(1);
    }

    let existing = await User.findOne({ email });

    if (existing) {
      console.log("✔ Main admin already exists:", email);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create main superadmin
    const user = new User({
      name: "Main Admin",
      email,
      passwordHash: hash,
      role // 👈 superadmin
    });

    await user.save();

    console.log("🎉 Main SUPERADMIN created:");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", role);

    process.exit(0);
  } catch (err) {
    console.error("Error creating main admin:", err);
    process.exit(1);
  }
}

main();

