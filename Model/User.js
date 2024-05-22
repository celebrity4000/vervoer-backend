const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parking",
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
