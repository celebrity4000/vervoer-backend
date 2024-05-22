const mongoose = require("mongoose");

const ParkingBooking = new mongoose.Schema({
  parkingOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  bookingBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  parkingAddress: Object,
  parkingOwnerDetails: Object,
  carOwnerDetails: Object,
  bookingDetails: Object,
  bookingStatus: {
    type: String,
    default: "booked",
    enum: ["booked", "empty"],
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("ParkingBooking", ParkingBooking);
