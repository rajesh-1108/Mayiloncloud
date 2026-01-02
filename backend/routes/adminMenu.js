const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const fs = require("fs");
const path = require("path");

/* ================= GET ALL MENU (ADMIN) ================= */
router.get("/", auth, admin, async (req, res) => {
  try {
    const items = await Menu.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to load menu" });
  }
});

/* ================= ADD MENU ITEM ================= */
router.post("/", auth, admin, async (req, res) => {
  try {
    const item = await Menu.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to add item" });
  }
});

/* ================= UPDATE MENU ITEM ================= */
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

/* ================= DELETE MENU ITEM + IMAGE ================= */
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.imageUrl) {
      const imagePath = path.join(
        __dirname,
        "..",
        item.imageUrl.replace("/", "")
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;




