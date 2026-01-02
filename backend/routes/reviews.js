const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Review = require("../models/Review");

/* ================================
   CREATE REVIEW
================================ */
router.post("/", auth, async (req, res) => {
  try {
    const { orderId, itemId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating" });
    }

    const order = await Order.findOne({
      _id: orderId,
      customer: req.user.id,
      status: "Delivered",
    });

    if (!order) {
      return res
        .status(400)
        .json({ message: "Order not eligible for review" });
    }

    const review = await Review.create({
      user: req.user.id,
      order: orderId,
      item: itemId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Review already submitted" });
    }
    res.status(500).json({ message: "Review failed" });
  }
});

/* ================================
   GET REVIEWS BY ITEM
================================ */
router.get("/item/:id", async (req, res) => {
  const reviews = await Review.find({ item: req.params.id })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.json(reviews);
});

module.exports = router;
