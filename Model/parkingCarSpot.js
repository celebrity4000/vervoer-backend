const mongoose = require("mongoose");

const parkingCarSpot = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  parkingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  parkingSpaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  spotName: {
    type: String,
    default: "",
  },
  spotNumber: {
    type: Number,
    default: 0,
  },
  spotPrice: {
    type: Number,
    default: 0,
  },
  spotZipCode: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "empty",
    enum: ["empty", "booked", "inactive"],
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

module.exports =  mongoose.model("parkingCarSpot", parkingCarSpot);
