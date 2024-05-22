const mongoose = require("mongoose");

const devicesSchema = new mongoose.Schema({
  deviceType: {
    type: String,
    trim: true,
  },
  deviceId: {
    type: String,
    trim: true,
  },
  token: {
    type: String,
    trim: true,
  },
});
const authDetailsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxlength: 255,
    trim: true,
    default: ""
  },
  lastName: {
    type: String,
    maxlength: 255,
    trim: true,
    default: ""
  },
  email: {
    type: String,
    maxlength: 255,
    trim: true,
    default: ""
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: String,
  },
  companyName:{
    type: String,
    default: ""
  },
  stripeDetails: {
    isAccountVerified: {
      type: Boolean,
      default: false
    },
    stripeMail: {
      type: String,
    },
    stripeAccountId: {
      type: String,
    }
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  password: {
    type: String,
  },

  forgotPasswordToken: {
    token: {
      type: String,
    },
    validTill: {
      type: String,
    },
  },
  image: {
    type: String,
    default: ""
  },
 
  age: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    default: ""
  },
  dob: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    maxlength: 255,
    trim: true,
    default: ""
  },
  state: {
    type: String,
    maxlength: 255,
    trim: true,
    default: ""
  },
  city: {
    type: String,
    maxlength: 255,
    trim: true,
    default: ""
  },
  pinCode: {
    type: String,
    trim: true,
    default: ""
  },
  address: {
    type: String,
    maxlength: 255,
    trim: true,
    default: ""
  },
  language: {
    type: String,
    default: "en"
  },
  description: {
    type: String,
    default: ""
  },
  walletAmount: {
    type: Number,
    default: 0
  },
  isUserBlocked: {
    type: Boolean,
    default: false,
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
  emailNotification:{
   type: Boolean,
   default:false
  },
  smsNotification:{
    type: Boolean,
    default:false
  },
  devices: devicesSchema,
  accountType: {
    type: String,
    required: true,
    trim: true,
    default: "user",
    enum: ["merchant", "user", "provider", "admin"],
  },
  accountStatus: {
    type: String,
    required: true,
    trim: true,
    default: "active",
    enum: ["active", "blocked", "inactive"],
  },
  qrCode: {
    type: String,
  },
  isDryCleaner: {
    type: Boolean,
    default: false,
  },
  isDriver: {
    type: Boolean,
    default: false,
  },
});

const Auth = mongoose.model("AuthDetails", authDetailsSchema);

module.exports = Auth;
