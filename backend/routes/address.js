const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

/* ================= ADD ADDRESS ================= */
router.post("/", auth, async (req, res) => {
  try {
    const { label = "Home", line1, city, state, pincode, phone } = req.body;

    if (!line1 || !city || !state || !pincode || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ message: "Invalid pincode" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.push({
      label,
      line1,
      city,
      state,
      pincode,
      phone,
    });

    await user.save();

    res.json({
      message: "Address saved",
      addresses: user.addresses,
    });
  } catch (err) {
    console.error("ADD ADDRESS ERROR:", err);
    res.status(500).json({ message: "Failed to save address" });
  }
});

/* ================= UPDATE ADDRESS ================= */
router.put("/:index", auth, async (req, res) => {
  try {
    const index = Number(req.params.index);

    const user = await User.findById(req.user.id);
    if (!user || !user.addresses[index]) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses[index] = {
      ...user.addresses[index],
      ...req.body,
    };

    await user.save();
    res.json(user.addresses);
  } catch (err) {
    console.error("UPDATE ADDRESS ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ================= DELETE ADDRESS ================= */
router.delete("/:index", auth, async (req, res) => {
  try {
    const index = Number(req.params.index);

    const user = await User.findById(req.user.id);
    if (!user || !user.addresses[index]) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses.splice(index, 1);
    await user.save();

    res.json({ message: "Address deleted", addresses: user.addresses });
  } catch (err) {
    console.error("DELETE ADDRESS ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;

