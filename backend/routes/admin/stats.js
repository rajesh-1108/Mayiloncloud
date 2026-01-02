const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

/* ===============================
   ADMIN – SALES STATS
================================ */
router.get("/", async (req, res) => {
  try {
     const deliveredOrders = await Order.find({
      status: "Delivered",
      paymentStatus: "Paid",
    });
    const totalSales = deliveredOrders.reduce(
      (sum, o) => sum + o.totalAmount,
      0
    );
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);

    const paidMatch = { paymentStatus: "Paid" };

    /* TOTAL SALES */
    

    /* TODAY SALES */
    const todaySales = await Order.aggregate([
      { $match: { ...paidMatch, createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    /* WEEK SALES */
    const weekSales = await Order.aggregate([
      { $match: { ...paidMatch, createdAt: { $gte: startOfWeek } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    /* MONTH SALES */
    const monthSales = await Order.aggregate([
      { $match: { ...paidMatch, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    /* ITEM WISE SALES */
    const itemSales = await Order.aggregate([
      { $match: paidMatch },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          qty: { $sum: "$items.qty" },
          revenue: {
            $sum: { $multiply: ["$items.price", "$items.qty"] },
          },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json({
      totalSales: totalSales[0]?.total || 0,
      todaySales: todaySales[0]?.total || 0,
      weekSales: weekSales[0]?.total || 0,
      monthSales: monthSales[0]?.total || 0,
      itemSales,
      totalSales,
      deliveredCount: deliveredOrders.length,
      pendingCount: await Order.countDocuments({ status: "Pending" }),
      totalOrders: await Order.countDocuments(),
    });
  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
});

module.exports = router;