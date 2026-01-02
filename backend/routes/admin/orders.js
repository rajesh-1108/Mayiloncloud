const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

const Order = require("../../models/Order");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const sendWhatsApp = require("../../utils/sendWhatsApp");

/* =====================================================
   CONSTANTS
===================================================== */
const ALLOWED_STATUSES = [
  "Pending",
  "Accepted",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const STATUS_MESSAGES = {
  Pending: "🕒 Your order has been placed successfully",
  Accepted: "✅ Your order has been accepted by the kitchen",
  Preparing: "👨‍🍳 Your food is being prepared",
  "Out for Delivery": "🚚 Your food is on the way",
  Delivered: "🎉 Order delivered. Enjoy your meal!",
  Cancelled: "❌ Your order has been cancelled",
};

/* =====================================================
   ADMIN – GET ALL ORDERS
===================================================== */
router.get("/", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find({ archived: false })
      .populate("customer", "name email")
      .populate("review")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("ADMIN GET ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to load orders" });
  }
});

/* =====================================================
   ADMIN – UPDATE STATUS
===================================================== */
router.put("/:id/status", auth, admin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id).populate(
      "customer",
      "name email"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update status
    order.status = status;
if (status === "Delivered") {
  order.paymentStatus = "Paid"; // 🔥 VERY IMPORTANT
}

await order.save();
    // Status timeline safe push
    if (!order.statusTimeline) order.statusTimeline = [];
    order.statusTimeline.push({
      status,
      time: new Date(),
    });

    await order.save();

    // Auto-print kitchen receipt when accepted
    if (status === "Accepted") {
      console.log("🖨 Printing receipt for kitchen:", order._id);
    }

    // WhatsApp notification
    if (order.deliveryAddress?.phone) {
      const message = `
📦 Order Update

Order ID: ${order._id.toString().slice(-6)}
${STATUS_MESSAGES[status]}

Thank you for ordering ❤️
      `.trim();

      sendWhatsApp(order.deliveryAddress.phone, message);
    }

    res.json({ message: "Status updated", order });
  } catch (err) {
    console.error("ADMIN STATUS UPDATE ERROR:", err);
    res.status(500).json({ message: "Status update failed" });
  }
});

/* =====================================================
   ADMIN – ASSIGN DELIVERY PARTNER
===================================================== */
router.put("/:id/assign", auth, admin, async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res
        .status(400)
        .json({ message: "Delivery name & phone required" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryPartner: { name, phone } },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    // WhatsApp notify
    if (order.deliveryAddress?.phone) {
      sendWhatsApp(
        order.deliveryAddress.phone,
        `🚚 Delivery Partner Assigned\nName: ${name}\nPhone: ${phone}`
      );
    }

    res.json({ message: "Delivery assigned", order });
  } catch (err) {
    console.error("ASSIGN DELIVERY ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* =====================================================
   ADMIN – STATS
===================================================== */
router.get("/stats", auth, admin, async (req, res) => {
  try {
    const totalSalesAgg = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const stats = {
      totalSales: totalSalesAgg[0]?.total || 0,
      ordersCount: await Order.countDocuments({ archived: false }),
      deliveredCount: await Order.countDocuments({ status: "Delivered" }),
      pendingCount: await Order.countDocuments({ status: "Pending" }),
    };

    res.json(stats);
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
});

/* =====================================================
   MONTHLY REPORT
===================================================== */
router.get("/report/monthly", auth, admin, async (req, res) => {
  try {
    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const sales = await Order.aggregate([
      { $match: { createdAt: { $gte: start }, paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      month: start.toLocaleString("default", { month: "long" }),
      total: sales[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Monthly report failed" });
  }
});

/* =====================================================
   EXPORT PDF
===================================================== */
router.get("/export/pdf", auth, admin, async (req, res) => {
  const orders = await Order.find().populate("customer");

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=orders.pdf");

  doc.pipe(res);

  doc.fontSize(20).text("Orders Report", { align: "center" });
  doc.moveDown(2);

  orders.forEach((o, i) => {
    doc
      .fontSize(12)
      .text(`${i + 1}. Order: ${o._id}`)
      .text(`Customer: ${o.customer?.name}`)
      .text(`Total: ₹${o.totalAmount}`)
      .text(`Status: ${o.status}`)
      .moveDown();
  });

  doc.end();
});

/* =====================================================
   EXPORT EXCEL
===================================================== */
router.get("/export/excel", auth, admin, async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Orders");

  sheet.columns = [
    { header: "Order ID", key: "id" },
    { header: "Customer", key: "name" },
    { header: "Total", key: "total" },
    { header: "Status", key: "status" },
  ];

  const orders = await Order.find().populate("customer");

  orders.forEach((o) => {
    sheet.addRow({
      id: o._id,
      name: o.customer?.name,
      total: o.totalAmount,
      status: o.status,
    });
  });

  res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

  await workbook.xlsx.write(res);
  res.end();
});

/* =====================================================
   ARCHIVE ORDER
===================================================== */
router.put("/:id/archive", auth, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Archive failed" });
  }
});

/* =====================================================
   CLEAR ALL ORDERS
===================================================== */
router.delete("/", auth, admin, async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: "All orders cleared" });
  } catch (err) {
    res.status(500).json({ message: "Clear failed" });
  }
});

/* =====================================================
   DELETE ONE ORDER
===================================================== */
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;






