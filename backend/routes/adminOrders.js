const express = require("express");
const router = express.Router(); // ✅ ONLY ONCE

const Order = require("../models/Order");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/* GET ALL ORDERS */
router.get("/orders", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE ORDER STATUS */
router.put("/orders/:id/status", auth, admin, async (req, res) => {
  const { status } = req.body;

  const allowed = [
    "PLACED",
    "CONFIRMED",
    "COOKING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];
// pseudo
sendWhatsApp(
  order.deliveryAddress.phone,
  `Order ${order._id} status updated to ${status}`
);

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    ).populate("user", "name email");

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
