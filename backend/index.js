require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const auth = require("./middleware/auth");
const admin = require("./middleware/admin");
const superadmin = require("./middleware/superadmin");

const app = express();
const PORT= process.env.PORT || 5000;

/* ================= MIDDLEWARE ================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://yourdomain.com",
];

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://mayiloncloud.netlify.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.options("*", cors()); // ✅ VERY IMPORTANT



app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= PUBLIC ROUTES ================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/menu", require("./routes/menu")); // customer menu
app.use("/api/contact", require("./routes/contact"));
app.use("/api/reviews", require("./routes/reviews"));

/* ================= USER ROUTES ================= */
app.use("/api/address", auth, require("./routes/address"));
app.use("/api/orders", require("./routes/orders")); // auth handled inside

/* ================= ADMIN ROUTES ================= */
app.use("/api/admin/upload-image", auth, admin, require("./routes/upload"));

app.use("/api/admin/menu", auth, admin, require("./routes/adminMenu"));

app.use("/api/admin/orders", auth, admin, require("./routes/admin/orders"));

app.use("/api/admin/customers", auth, admin, require("./routes/admin/customers"));

app.use("/api/admin/stats", auth, admin, require("./routes/admin/stats"));

/* ================= SUPER ADMIN ROUTES ================= */
app.use("/api/admin/users", auth, superadmin, require("./routes/adminUsers"));

app.use(
  "/api/admin/create-admin",
  auth,
  superadmin,
  require("./routes/adminCreateAdmin")
);

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ================= SERVER ================= */
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});


