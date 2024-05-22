const mongoose = require("mongoose");

const State = new mongoose.Schema({
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
    },
    country: {
        type: String,
    },
    states: {
        type: [String],
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model("State", State);;
