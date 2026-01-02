const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const superadmin = require("../middleware/superadmin");

const router = express.Router();

// GET all admin users (superadmin only)
router.get("/", async (req, res) => {
  const users = await User.find({ role: { $ne: "user" } });
  res.json(users);
});
router.get("/users", auth, superadmin, async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["admin", "superadmin"] },
    }).sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset password
router.post("/reset-user-password", auth, superadmin, async (req, res) => {
  try {
    const { userId } = req.body;

    const tempPassword = Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(tempPassword, 10);

    await User.findByIdAndUpdate(userId, {
      passwordHash: hash,
    });

    res.json({ tempPassword });
  } catch (err) {
    console.error("reset pw error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete user
router.delete("/user/:id", auth, superadmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("delete error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
