const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  parkingName: {
    type: String,
    default: "",
  },
  parkingAddress: {
    type: String,
    default: "",
  },
  parkingState: {
    type: String,
    default: "",
  },
  parkingCity: {
    type: String,
    default: "",
  },
  zipCode: {
    type: String,
    default: "",
  },
  parkingImage: {
    type: String,
    default: "",
  },
  parkingDescription: {
    type: String,
    default: "",
  },
  parkingSpaceCount: {
    type: Number,
    default: 0,
  },
  parkingType: {
    type: String,
    default: "parking_lot",
    enum: ["residence", "parking_lot", "garage"],
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"],
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

module.exports = mongoose.model("Parking", parkingSchema);
