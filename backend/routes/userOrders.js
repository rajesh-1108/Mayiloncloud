const express = require("express");
const auth = require("../middleware/auth");
const Order = require("../models/Order");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.json(orders);
});

module.exports = router;
