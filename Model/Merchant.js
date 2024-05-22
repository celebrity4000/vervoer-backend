const mongoose = require("mongoose");
const Auth = require("./Auth");

const merchantSchema = new mongoose.Schema({
  // basicInfo: User,
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    },
  isApproved: {
    type: Boolean,
    default: false
  },
  isRatingApproved:{
   type: Boolean,
   default: true
  },
  isEnsure:{
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Merchant = mongoose.model("Merchant", merchantSchema);

module.exports = Merchant;
