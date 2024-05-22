const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  parkingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parking",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  duration: {
    type: String,
  },
  date: {
    type: String,
  },
  startTime: {
    type: DATE,
  },
  endTime: {
    type: DATE,
  },
  isFeePaid: {
    type: Boolean,
    default: false,
  },
  
  status: {
    type: String,
    enum: ["confirmed","sent", "pending", "accepted","rejected", "cancelled", "start", "completed"],
  },
 
  isBookingCancelled: {
    cancelBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    value: {
      type: Boolean,
      default: false,
    },
    cancellationReason: {
      type: String,
      maxlength: 255,
      trim: true,
    },
  },
  paidAmount: {
    type: Number,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  paymentAmount: {
    type: Number,
  },
  isStarted: {
    type: Boolean,
    default: false,
  },
  isEnabled: {
    type: Boolean,
    default: false
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

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
