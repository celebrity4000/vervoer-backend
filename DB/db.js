const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://kedernath:Keder1234@verover.1otujbw.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error in database connection", err.message));

const db = mongoose.connection;

module.exports = db;