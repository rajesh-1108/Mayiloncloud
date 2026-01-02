const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const auth = require("../middleware/auth");
const superadmin = require("../middleware/superadmin");

const router = express.Router();

// POST /api/admin/create-admin
router.post("/create-admin", auth, superadmin, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // auto generated password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(tempPassword, 10);

    const user = await User.create({
      name,
      email,
      passwordHash: hashed,
      role: "admin",
    });

    res.json({
      message: "Admin created successfully",
      user,
      tempPassword,
    });
  } catch (err) {
    console.error("CREATE ADMIN ERROR:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = router;

