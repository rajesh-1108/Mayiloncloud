const express = require("express");
const router = express.Router();
const Menu = require("../../models/Menu");

/* ================= ADMIN MENU ================= */

// GET ALL MENU ITEMS
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find().sort({ createdAt: -1 });
    res.json(menu);
  } catch (err) {
    console.error("ADMIN MENU ERROR:", err);
    res.status(500).json({ message: "Failed to load menu" });
  }
});
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        foodType: req.body.foodType,
        imageUrl: req.body.imageUrl,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD / UPDATE / DELETE routes here later

module.exports = router;



