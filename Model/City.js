const mongoose = require("mongoose");

const City = new mongoose.Schema({
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  cities: {
    type: Object,
  },
  city: {
    type: String,
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

module.exports = mongoose.model("City", City);
