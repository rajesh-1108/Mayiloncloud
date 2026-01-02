const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");

/* ================= PUBLIC MENU ================= */
router.get("/", async (req, res) => {
  try {
    const items = await Menu.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to load menu" });
  }
});

module.exports = router;

