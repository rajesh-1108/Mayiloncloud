const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: String,
    price: Number, // rupees
    image: String, // URL
    isVeg: Boolean
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
