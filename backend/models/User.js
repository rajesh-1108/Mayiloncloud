const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    passwordHash: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    photo: {
      type: String, // Google profile picture URL
    },

    addresses: [
  {
    label: {
      type: String,
      enum: ["Home", "Work"],
      default: "Home",
    },
    line1: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "Invalid pincode"],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Invalid phone"],
    },
  },
],

    resetToken: String,
    resetExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);


