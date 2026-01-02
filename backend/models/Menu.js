const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },

    foodType: {
      type: String,
      enum: ["Veg", "Non-Veg"],
      required: true,
    },

    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", MenuSchema);



