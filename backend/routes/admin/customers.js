const express = require("express");
const router = express.Router();
const User = require("../../models/User");

/* ===============================
   ADMIN – GET ALL CUSTOMERS
================================ */
router.get("/", async (req, res) => {
  try {
    const customers = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(customers);
  } catch (err) {
    console.error("ADMIN CUSTOMERS ERROR:", err);
    res.status(500).json({ message: "Failed to load customers" });
  }
});

module.exports = router;
