const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        _id: String,
        name: String,
        price: Number,
        qty: Number,
        imageUrl: String,
      },
    ],

    totalAmount: Number,

    paymentMethod: {
      type: String,
      enum: ["ONLINE", "COD"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
archived: {
  type: Boolean,
  default: false,
},

    /* ✅ ORDER TIMELINE (Swiggy style) */
    statusTimeline: [
      {
        status: String,
        time: { type: Date, default: Date.now },
      },
    ],

    /* ✅ DELIVERY PARTNER ASSIGNMENT */
    deliveryPartner: {
      name: String,
      phone: String,

    },
review: {
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comment: String,
  reviewedAt: Date,
},

    deliveryAddress: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
      location: {
        lat: Number,
        lng: Number,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);


