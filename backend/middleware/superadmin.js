module.exports = function (req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Superadmin only" });
    }

    next();
  } catch (err) {
    console.error("superadmin middleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

