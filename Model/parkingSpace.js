const mongoose = require("mongoose");

const parkingSpace = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  parkingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  parkingSpaceName: {
    type: String,
    default: "",
  },
  parkingSpaceNumber: {
    type: Number,
    default: 0,
  },
  parkingSpacePrice: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "incomplete",
    enum: ["active", "inactive", "incomplete"],
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

module.exports = mongoose.model("parkingSpace", parkingSpace);
