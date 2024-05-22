const mongoose = require("mongoose");

const Order = new mongoose.Schema({
  ////////////////*** Parking Booking Payment Details ***////////////////////////////
  parkingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parking",
  },
  parkingSpotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "parkingCarSpot",
  },
  parkingCarSpotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "parkingCarSpot",
  },
  ///////////////////////////////////////////////////////////////////////////

  ////////////////*** Dry Cleaner Booking Payment Details ***////////////////////////

  ///////////////////////////////////////////////////////////////////////////

  ////////////////*** General  ***////////////////////////

  bookingId: {
    type: String,
    ref: "ParkingBooking",
  },
  bookingType: {
    type: String,
    default: "prk",
    enum: ["prk", "dryc"],
  },

  zipCode: {
    type: String,
    default: "default",
  },

  address: {
    type: String
  },

  name: {
    type: String
  },

  ////////////////////////////////////////////////////////

  ////////////////*** Payment General  ***////////////////////////

  paymentIntent: { type: String },
  moneyValue: {
    type: String,
  },
  currencyCode: {
    type: String,
  },
  reciept_url: { type: String },
  otp: {
    type: String,
  },
  status: {
    type: String,
    default: "incomplete",
    enum: ["success", "failure", "incomplete"],
  },
  payment_method_details: { type: String },
  billing_address_details: { type: String },
  billing_mail: { type: String },
  webhook_id: { type: String },
  customerId: {
    type: String,
  },

  ///////////////////////////////////////////////////////////////

  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", Order);
