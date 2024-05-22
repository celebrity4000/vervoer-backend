const mongoose = require("mongoose");

const dryCleanerBooking = new mongoose.Schema({
  bookingBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  bookingTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  bookingByUserName: {
    type: String,
    default: "",
  },
  bookingToDryCleanerName: {
    type: String,
    default: "",
  },
  bookingByUserAddress: {
    type: String,
    default: "",
  },
  bookingItems: [
    {
      itemName: String,
      itemQuantity: String,
      itemPrice: String,
      itemAttributes: Object,
    },
  ],
  pickupLocation: {
    type: String,
    default: "",
  },
  dropLocation: {
    type: String,
    default: "",
  },
  totalPrice: {
    type: String,
    default: "0",
  },
  paymentBy: {
    type: String,
    default: "cash",
    enum: ["cash", "online"],
  },
  paymentStatus: {
    type: String,
    default: "pending",
    enum: ["pending", "failed", "success"],
  },
  bookingStatus: {
    type: String,
    default: "pending",
    enum: ["pending", "confirmed", "cancelled"],
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
  bookingByUserMobile: {
    type: String,
    default: "",
  },
  bookingByVendorMobile: {
    type: String,
    default: "",
  },
});

const bookingDryCleaner = mongoose.model(
  "dryCleanerBooking",
  dryCleanerBooking
);
module.exports = bookingDryCleaner;
