const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// GET all customers
router.get("/customers", auth, admin, async (req, res) => {
  try {
    let users = await User.find({ role: "user" }).lean();

    // Count orders for each user
    for (let u of users) {
      u.orderCount = await Order.countDocuments({ customer: u._id });
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Block/unblock user
router.put("/customers/block", auth, admin, async (req, res) => {
  try {
    const { id, blocked } = req.body;

    const user = await User.findByIdAndUpdate(id, { blocked }, { new: true });

    res.json({ message: blocked ? "User blocked" : "User unblocked", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
