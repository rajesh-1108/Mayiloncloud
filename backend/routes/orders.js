const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");

/* ===============================
   CREATE ORDER (CASH ON DELIVERY)
================================ */
router.post("/cod", auth, async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = items.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );

    const order = await Order.create({
      customer: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: "COD",
      paymentStatus: "Pending",
     orderStatus: "PLACED",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to place COD order" });
  }
});

/* ===============================
   VERIFY ONLINE PAYMENT
================================ */
router.post("/verify", auth, async (req, res) => {
  try {
    const { localOrderId } = req.body;

    if (!localOrderId) {
      return res.status(400).json({ message: "Order ID missing" });
    }

    const order = await Order.findByIdAndUpdate(
      localOrderId,
      {
        paymentStatus: "Paid",
        paymentMethod: "ONLINE",
        orderStatus: "PLACED",
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Payment verified",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
});
// ===============================
// ADD REVIEW (CUSTOMER)
// ===============================
router.post("/:id/review", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user.id,
      status: "Delivered",
    });

    if (!order) {
      return res
        .status(400)
        .json({ message: "Order not eligible for review" });
    }

    if (order.review?.rating) {
      return res
        .status(400)
        .json({ message: "Review already submitted" });
    }

    order.review = {
      rating,
      comment,
      reviewedAt: new Date(),
    };

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Review failed" });
  }
});

/* ===============================
   CUSTOMER: MY ORDERS
================================ */
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to load orders" });
  }
});

/* ===============================
   CUSTOMER: ORDER DETAILS
================================ */
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Prevent other users from viewing
    if (
      order.customer._id.toString() !== req.user.id &&
      req.user.role === "user"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to load order" });
  }
});

/* ===============================
   CUSTOMER: CANCEL ORDER
================================ */
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["Delivered", "Out for Delivery"].includes(order.orderStatus)) {
      return res
        .status(400)
        .json({ message: "Order cannot be cancelled now" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Cancel failed" });
  }
});

module.exports = router;
