const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");

const userRoute = require("./Routes/userRoute");
const merchantRoute = require("./Routes/merchantRoute");
const providerRoute = require("./Routes/providerRoute");
const authRoute = require("./Routes/authRoute");
const apiRoute = require("./Routes/api");
const adminRoute = require("./Routes/admin");
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();

app.use(cors());
require("./DB/db");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cors());
app.use(fileUpload());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/merchant", merchantRoute);
app.use("/provider", providerRoute);
app.use("/api", apiRoute);
app.use("/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello world from api--");
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on ${port}`));
app.use(function (req, res, next) {
  req.setEncoding("utf8");
  next();
});

module.exports = app;
