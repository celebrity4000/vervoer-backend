const Country = require("../../Model/Country");
const State = require("../../Model/State");
const City = require("../../Model/City");
const Pincode = require("../../Model/Pincode");

exports.savePinCodeData = async (req, res) => {
  let stateDetails;
  try {
    const { countryName, stateName, cityName, pinCode } = req.body;

    let countryDetails = await Country.findOne({ countryName });
    if (!countryDetails) {
      countryDetails = await Country.create({ name: countryName });
    }

    let countryId = countryDetails._id;

    if (!stateDetails) {
      stateDetails = await State.create({
        countryId,
        country: countryName,
        states: [stateName],
      });
    }

    let stateId = stateDetails._id;

    let cityDetails = await City.findOne({
      city: cityName,
      country: countryName,
    });

    if (!cityDetails) {
      cityDetails = await City.create({
        countryId,
        cities: [cityName],
        country: countryName,
        city: cityName,
        state: stateName,
      });
    }

    let cityId = cityDetails._id;

    let pinCodeDetails = await Pincode.findOne({
      country: countryName,
      zip: pinCode,
      city: cityName,
      state_name: stateName,
    });

    if (pinCodeDetails)
      return res
        .status(200)
        .json({ success: false, msg: "PinCode already exists" });

    pinCodeDetails = await Pincode.create({
      country: countryName,
      city: cityName,
      state_name: stateName,
      zip: pinCode,
    });

    return res
      .status(200)
      .json({ success: true, msg: "PinCode Saved", data: pinCodeDetails });
  } catch (err) {
    console.log(err);
  }
};

exports.countryList = async (req, res) => {
  let model = await Country.find({}).sort({ name: "asc" });
  return res.status(200).json({ success: true, data: model });
};

exports.stateList = async (req, res) => {
  try {
    let model = await State.findOne({ country: req.query.country });
    return res.status(200).json({
      success: true,
      data: {
        states: model.states.sort(),
      },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(200)
      .json({ success: false, msg: "Something went wrong" });
  }
};

exports.cityList = async (req, res) => {
  // City.collection.remove();
  // Pincode.collection.remove();

  try {
    const state = req.query.state;
    const country = req.query.country;
    if (!state || !country) {
      return res
        .status(200)
        .json({ success: false, msg: "Please select country and state" });
    }
    // find cities by index of state
    let model = await City.findOne(
      {
        country: country,
      },
      {
        _id: 0,
        cities: 1,
      }
    );

    const data = model.cities[state];

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.log(err);
    return res
      .status(200)
      .json({ success: false, msg: "Something went wrong" });
  }
};

exports.pinCodeList = async (req, res) => {
  let perPage = parseInt(req.query.paePage) ? parseInt(req.query.paePage) : 20;
  let pageNumber = parseInt(req.query.pageNumber)
    ? parseInt(req.query.pageNumber)
    : 1;
  let skipPage = (pageNumber - 1) * perPage;
  let model = [];

  let totalCount = 0;

  // if city is selected
  if (req.query.searchCode) {
    model = await Pincode.find({ city: req.query.searchCode })
      .limit(perPage)
      .skip(skipPage)
      .sort({ state_name: "asc", city: "asc" });
    totalCount = await Pincode.countDocuments({ city: req.query.searchCode });
  } else {
    model = await Pincode.find({})
      .limit(perPage)
      .skip(skipPage)
      .sort({ state_name: "asc", city: "asc" });
    totalCount = await Pincode.countDocuments({});
  }
  return res
    .status(200)
    .json({ success: true, data: model, perPage, pageNumber, totalCount });
};

exports.deletePinCode = async (req, res) => {
  await Pincode.deleteOne({ _id: req.body.pinCodeId });
  return res.status(200).json({ success: true, msg: "deleted" });
};
