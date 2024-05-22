const Auth = require("../../Model/Auth");
const Parking = require("../../Model/Parking");
const HostSpace = require("../../Model/parkingSpace");
const parkingCarSpot = require("../../Model/parkingCarSpot");
const ParkingBooking = require("../../Model/ParkingBooking");
const randomString = require("randomstring");
const path = require("path");
const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));

exports.getParkingData = async (req, res) => {
  let model = await Parking.findOne({ userId: req.data.id });
  return res.status(200).json({ success: true, data: model });
};

exports.registerParking = async (req, res) => {
  let parkingStatus = "update";
  let model = await Parking.findOne({ userId: req.data.id });
  if (!model) {
    model = await Parking.create({ userId: req.data.id });
    parkingStatus = "create";
  }
  if (req.body.parkingName) model.parkingName = req.body.parkingName;
  if (req.body.parkingAddress) model.parkingAddress = req.body.parkingAddress;
  if (req.body.parkingState) model.parkingState = req.body.parkingState;
  if (req.body.parkingCity) model.parkingCity = req.body.parkingCity;
  if (req.body.zipCode) {
    model.zipCode = req.body.zipCode;
    updateAllCarSpaceZipCode(model._id, req.body.zipCode);
  }
  if (req.body.parkingDescription)
    model.parkingDescription = req.body.parkingDescription;
  if (parkingStatus == "create" && parseInt(req.body.parkingSpaceNumber) > 0) {
    model.parkingSpaceCount = parseInt(req.body.parkingSpaceNumber);
    await parkingSpaceCreate(model, parseInt(req.body.parkingSpaceNumber));
  }
  await model.save();

  if (req.files) {
    console.log("have parking image");
    let profileImage = req.files.profileImage;
    let ext = profileImage.name.slice(profileImage.name.lastIndexOf("."));
    let userProfileImageName = randomString.generate(15) + ext;
    let saveTo = path.join("./public/parking/" + userProfileImageName.trim());
    profileImage.mv(saveTo, async function (err) {
      console.log("parking image saving");
      if (err) console.log(err);
      else {
        model.parkingImage = "/public/parking/" + userProfileImageName;
        model.save();
      }
    });
  }
  console.log("Parking registration complete");
  return res.status(200).json({ success: true, msg: "saved", data: model });
};

async function parkingSpaceCreate(model, parkingSpaceNumber) {
  let totalHostSpace = await HostSpace.countDocuments({ parkingId: model._id });
  if (totalHostSpace == 0) {
    for (let index = 0; index < parkingSpaceNumber; index++) {
      const charIndex = index % 26;
      const additionCount = Math.ceil((index + 1) / 26);
      let hostSpaceName = "";
      for (let i = 0; i < additionCount; i++) {
        hostSpaceName += alphabet[charIndex];
      }
      await createHostSpace(model._id, hostSpaceName, index + 1, model.userId);
    }
  }
  return true;
}

// exports.parkingSpaceGenerate = async (req, res) => {
//     //// await HostSpace.collection.remove();
//     try {
//         let model = await Parking.findById(req.body.parkingId);
//         if(!model) return res.json({ success: false, error: "Parking not found" });
//         let parkingSpaceNumber = parseInt(req.body.parkingSpaceNumber);
//         if(parkingSpaceNumber > 50) return res.json({ success: false, error: "Maximum 50 host space allowed" });
//         await parkingSpaceCreate(model, parkingSpaceNumber);
//         return res.status(200).json({ success: true, msg: "saved"  });
//     } catch (error) {
//         return res.json({ success: false, error: "Invalid Parking" });
//     }
// };

async function createHostSpace(
  parkingId,
  parkingSpaceName,
  parkingSpaceNumber,
  userId
) {
  return HostSpace.create({
    parkingId,
    parkingSpaceName,
    parkingSpaceNumber,
    userId,
  });
}

exports.parkingSpaceList = async (req, res) => {
  let filterType = req.query.filterType ? req.query.filterType : "all";
  let model = [];
  if (filterType == "have-price") {
    model = await HostSpace.find({
      parkingId: req.query.parkingId,
      parkingSpacePrice: { $ne: 0 },
    });
  } else if (filterType == "incomplete") {
    model = await HostSpace.find({ status: "incomplete" });
  } else {
    model = await HostSpace.find({ parkingId: req.query.parkingId });
  }
  return res.status(200).json({ success: true, data: model });
};

// exports.parkingSpacePriceUpdate = async (req, res) => {
//     try {
//         let model = await HostSpace.findById(req.body.parkingSpaceId);
//         if(!model) return res.json({ success: false, error: "Invalid Parking Space" });
//         if(req.body.isAppliedForAll){
//             model = await HostSpace.find({ parkingId: model.parkingId });
//             for(let data of model){
//                 data.parkingSpacePrice = req.body.parkingSpacePrice;
//                 await data.save();
//                 updateAllCarSpacePrices(data._id, req.body.parkingSpacePrice);
//             }
//         } else {
//             model.parkingSpacePrice = req.body.parkingSpacePrice;
//             await model.save();
//             updateAllCarSpacePrices(model._id, req.body.parkingSpacePrice);
//         }
//         return res.status(200).json({ success: true, msg: "updated" });
//     } catch (error) {
//         return res.json({ success: false, error: "Something internal server error" });
//     }
// };

// async function updateAllCarSpacePrices(parkingSpaceId, spotPrice) {
//     let model = await parkingCarSpot.find({ parkingSpaceId });
//     model.forEach(data => {
//         data.spotPrice = spotPrice;
//         data.save();
//     });
//     return true;
// }

async function updateAllCarSpaceZipCode(parkingId, spotZipCode) {
  let model = await parkingCarSpot.find({ parkingId });
  model.forEach((data) => {
    data.spotZipCode = spotZipCode;
    data.save();
  });
  return true;
}

exports.parkingCarSpaceGenerate = async (req, res) => {
  //// await parkingCarSpot.collection.remove();
  try {
    for (let data of req.body.carSpaceObj) {
      await parkingCarSpaceCreate(
        data.parkingSpaceId,
        parseInt(data.numberOfCarCapacity),
        data.parkingSpacePrice
      );
    }
    return res.status(200).json({ success: true, msg: "saved" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error: "Invalid Parking Space" });
  }
};

async function parkingCarSpaceCreate(
  parkingSpaceId,
  numberOfCarCapacity,
  parkingSpacePrice
) {
  let model = await HostSpace.findById(parkingSpaceId);
  if (!model) return;
  model.status = "active";
  model.parkingSpacePrice = parkingSpacePrice;
  await model.save();
  let parkingData = await Parking.findById(model.parkingId);

  let totalCarSpot = await parkingCarSpot.countDocuments({
    parkingSpaceId: parkingSpaceId,
  });
  if (totalCarSpot == 0) {
    for (let index = 1; index <= numberOfCarCapacity; index++) {
      let formatSpaceNumber = numberFormat(index);
      let generateSpotName = model.parkingSpaceName + formatSpaceNumber;
      await generateCarSpot(
        model.parkingId,
        parkingSpaceId,
        generateSpotName,
        parseInt(formatSpaceNumber),
        model.parkingSpacePrice,
        parkingData.zipCode,
        parkingData.userId
      );
    }
  }
  return;
}

async function generateCarSpot(
  parkingId,
  parkingSpaceId,
  spotName,
  spotNumber,
  spotPrice,
  spotZipCode,
  userId
) {
  return parkingCarSpot.create({
    parkingId,
    parkingSpaceId,
    spotName,
    spotNumber,
    spotPrice,
    spotZipCode,
    userId,
  });
}

function numberFormat(n) {
  return n > 9 ? "" + n : "0" + n;
}

exports.carSpotList = async (req, res) => {
  let { parkingSpaceId } = req.query;
  let model = await parkingCarSpot.find({ parkingSpaceId });
  return res.status(200).json({ success: true, data: model });
};

exports.activeInactiveParkingSpace = async (req, res) => {
  try {
    let model = await HostSpace.findById(req.body.parkingSpaceId);
    if (model.status == "active") model.status = "inactive";
    else if (model.status == "inactive") model.status = "active";
    await model.save();
    return res.status(200).json({ success: true, msg: "updated" });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: "Something internal server error",
    });
  }
};

exports.activeInactiveCarSpot = async (req, res) => {
  try {
    let model = await parkingCarSpot.findById(req.body.carSpotId);
    if (model.status == "booked")
      return res.json({
        success: false,
        error: "Can't inactivate, currently this place under booked",
      });
    if (model.status == "empty") model.status = "inactive";
    else if (model.status == "inactive") model.status = "empty";
    await model.save();
    return res.status(200).json({ success: true, msg: "updated" });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: "Something internal server error",
    });
  }
};

exports.createNewParkingSpace = async (req, res) => {
  try {
    let model = await Parking.findById(req.body.parkingId);
    if (!model) return res.json({ success: false, error: "Parking not found" });
    let parkingSpaceCount = parseInt(model.parkingSpaceCount);
    model.parkingSpaceCount = ++parkingSpaceCount;
    model.save();

    let totalHostSpace = await HostSpace.countDocuments({
      parkingId: req.body.parkingId,
    });
    const charIndex = totalHostSpace % 26;
    const additionCount = Math.ceil((totalHostSpace + 1) / 26);
    let hostSpaceName = "";
    for (let i = 0; i < additionCount; i++) {
      hostSpaceName += alphabet[charIndex];
    }
    let parkingSpace = await createHostSpace(
      req.body.parkingId,
      hostSpaceName,
      totalHostSpace + 1,
      model.userId
    );
    parkingSpace.status = "incomplete";
    await parkingSpace.save();
    return res
      .status(200)
      .json({ success: true, msg: "created", data: parkingSpace });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: "Something internal server error",
    });
  }
};

exports.createNewCarSpace = async (req, res) => {
  try {
    let model = await HostSpace.findById(req.body.parkingSpaceId);
    if (!model)
      return res.json({ success: false, error: "Invalid Parking Space" });
    let parkingData = await Parking.findById(model.parkingId);
    let totalCarSpot = await parkingCarSpot.countDocuments({
      parkingSpaceId: req.body.parkingSpaceId,
    });
    let formatSpaceNumber = numberFormat(++totalCarSpot);
    let generateSpotName = model.parkingSpaceName + formatSpaceNumber;
    let carSpace = await generateCarSpot(
      model.parkingId,
      req.body.parkingSpaceId,
      generateSpotName,
      parseInt(formatSpaceNumber),
      model.parkingSpacePrice,
      parkingData.zipCode,
      parkingData.userId
    );
    return res
      .status(200)
      .json({ success: true, msg: "created", data: carSpace });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: "Something internal server error",
    });
  }
};

exports.searchParkingSpot = async (req, res) => {
  try {
    let perPage = parseInt(req.query.paePage)
      ? parseInt(req.query.paePage)
      : 1000;
    let pageNumber = parseInt(req.query.pageNumber)
      ? parseInt(req.query.pageNumber)
      : 1;
    let skipPage = (pageNumber - 1) * perPage;
    let totalCount = await parkingCarSpot.countDocuments({
      spotZipCode: req.query.zipCode,
      status: "empty",
    });
    let model = await parkingCarSpot
      .find({ spotZipCode: req.query.zipCode, status: "empty" })
      .limit(perPage)
      .skip(skipPage);
    return res
      .status(200)
      .json({ success: true, data: model, perPage, pageNumber, totalCount });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: "Something internal server error",
    });
  }
};

exports.bookParkingSpot = async (req, res) => {
  try {
    let model = await parkingCarSpot.findById(req.body.parkingCarSpotId);
    if (!model)
      return res.json({ success: false, error: "Car space Not found" });
    let parkingSpaceDetails = await HostSpace.findById(model.parkingSpaceId);
    if (!parkingSpaceDetails)
      return res.json({ success: false, error: "Parking space Not Found" });
    let parkingDetails = await Parking.findById(model.parkingId);
    if (!parkingDetails)
      return res.json({ success: false, error: "Parking Not Found" });
    let parkingOwner = await Auth.findById(model.userId);
    let userDetails = await Auth.findById(req.data.id);
    let bookingDetails = {
      carSpotPlaceName: model.spotName,
      parkingCarSpotId: model._id,
      price: model.spotPrice,
    };
    const parkingBooking = await ParkingBooking.create({
      parkingOwnerId: model.userId,
      bookingBy: req.data.id,
      parkingAddress: parkingDetails,
      parkingOwnerDetails: parkingOwner,
      carOwnerDetails: userDetails,
      bookingDetails: bookingDetails,
      bookingStatus: "booked",
    });
    model.status = "booked";
    await model.save();
    return res.status(200).json({
      success: true,
      msg: "Booked",
      booking_details: model.toJSON(),
      parking_booking_id: parkingBooking._id,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: "Something internal server error",
    });
  }
};

exports.listBookedParkings = async (req, res) => {
  let perPage = parseInt(req.query.paePage)
    ? parseInt(req.query.paePage)
    : 1000;
  let pageNumber = parseInt(req.query.pageNumber)
    ? parseInt(req.query.pageNumber)
    : 1;
  let skipPage = (pageNumber - 1) * perPage;
  let filterType = req.query.filterType ? req.query.filterType : "user";
  try {
    let model = [];
    let totalCount = 0;
    if (filterType == "merchant") {
      totalCount = await ParkingBooking.countDocuments({
        parkingOwnerId: req.data.id,
      });

      model = await ParkingBooking.find({ parkingOwnerId: req.data.id })
        .limit(perPage)
        .skip(skipPage);

      const mod = [...model];

      mod.map(async (item, index) => {
        console.log(item);
        const auth = await Auth.findById(item.bookingBy);
        model[index].auth = auth;
        return model[index];
      });
    } else {
      totalCount = await ParkingBooking.countDocuments({
        bookingBy: req.data.id,
      });

      model = await ParkingBooking.find({ bookingBy: req.data.id })
        .limit(perPage)
        .skip(skipPage);

      const mod = model;

      mod.map(async (item, index) => {
        console.log(item);
        const auth = await Auth.findById(item.bookingBy);
        model[index].auth = auth;
        console.log(auth);
      });
    }
    return res
      .status(200)
      .json({ success: true, data: model, totalCount, perPage, pageNumber });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: "Something internal server error",
    });
  }
};

exports.releaseBookingSpot = async (req, res) => {
  try {
    let booking = await ParkingBooking.findById(req.body.bookingId);
    if (!booking)
      return res.json({ success: false, error: "Booking not found" });
    let model = await parkingCarSpot.findById(req.body.parkingCarSpotId);
    if (!model)
      return res.json({ success: false, error: "Car space Not found" });
    model.status = "empty";
    await model.save();
    booking.bookingStatus = "empty";
    await booking.save();
    return res.status(200).json({ success: true, msg: "Updated" });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: "Something internal server error",
    });
  }
};

exports.viewParking = async (req, res) => {
  try {
    let model = await Parking.findById(req.query.parkingId);
    return res.status(200).json({ success: true, data: model });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      error: "Something internal server error",
    });
  }
};
