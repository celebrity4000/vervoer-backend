const mongoose = require("mongoose");

const drycleaningSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  name: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  merchantName: {
    type: String,
    default: "",
  },
  merchantState: {
    type: String,
    default: "",
  },
  merchantCity: {
    type: String,
    default: "",
  },
  merchantAddress: {
    type: String,
    default: "",
  },
  availability: [
    {
      day: {
        type: String,
        default: "",
      },
      startTime: {
        type: String,
        default: "",
      },
      endTime: {
        type: String,
        default: "",
      },
    },
  ],
  acceptItems: Object,
  images: [
    {
      imageName: {
        type: String,
        default: "",
      },
    },
  ],

  about: {
    type: String,
    maxlength: 255,
    trim: true,
    default: "",
  },

  coordinates: {
    lng: {
      type: Number,
      default: 0,
    },
    lat: {
      type: Number,
      default: 0,
    },
  },
  status: {
    type: String,
    default: "inactive",
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

const Drycleaning = mongoose.model("Drycleaning", drycleaningSchema);
module.exports = Drycleaning;
