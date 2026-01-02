const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

/* ================= ALLOWED IMAGE TYPES ================= */
const imageTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/svg+xml",
];

/* ================= MULTER STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

/* ================= MULTER CONFIG ================= */
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (imageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type: " + file.mimetype));
    }
  },
});

/* ================= UPLOAD IMAGE ================= */
/**
 * POST /api/admin/upload
 * FormData: image
 */
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    url: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;





