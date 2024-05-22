const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema({
    name: {
        type: String,
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

module.exports = mongoose.model("Country", CountrySchema);;
