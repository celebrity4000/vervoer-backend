const Auth = require("../../Model/Auth");
const DryCleaning = require("../../Model/Drycleaning");
const dryCleanerBooking = require("../../Model/dryCleanerBooking");
const Parking = require("../../Model/Parking");
const parkingSpace = require("../../Model/parkingSpace");
const parkingCarSpot = require("../../Model/parkingCarSpot");

exports.listUser = async (req, res) => {
  let model = await Auth.find({ accountType: { $ne: "admin" } });
  return res.status(200).json({ success: true, data: model });
};

exports.userBlockUnBlock = async (req, res) => {
  let model = await Auth.findById(req.body.userId);
  let message = "";
  if (model && model.accountStatus == "blocked") {
    model.accountStatus = "active";
    message = "active";
  } else if (model && model.accountStatus == "active") {
    model.accountStatus = "blocked";
    message = "blocked";
  }
  await model.save();
  return res.status(200).json({ success: true, msg: message });
};

exports.deleteUser = async (req, res) => {
  if (req.body.userId) {
    const isValidId = await Auth.findOne({ phoneNumber: req.body.userId });
    if (isValidId) {
      const user = await Auth.db
        .collection("authdetails")
        .findOne({ phoneNumber: req.body.userId });

      const id = user._id;

      await Auth.deleteOne({ phoneNumber: req.body.userId });
      await DryCleaning.deleteMany({ userId: id });
      await dryCleanerBooking.deleteMany({ bookingBy: id });
      await dryCleanerBooking.deleteMany({ bookingTo: id });

      await Parking.deleteMany({ userId: id });
      await parkingSpace.deleteMany({ userId: id });
      await parkingCarSpot.deleteMany({ userId: id });
      return res.status(200).json({ success: true, msg: "deleted" });
    } else {
      return res.status(200).json({ success: false, msg: "provide valid Id" });
    }
  } else {
    return res.status(200).json({ success: false, msg: "provide Id" });
  }
};
