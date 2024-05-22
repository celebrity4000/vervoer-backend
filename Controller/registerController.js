const Auth = require("../Model/Auth");
const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
const keys = require("../Config/config");
const randomstring = require("randomstring");
const path = require("path");
const DryCleaning = require("../Model/Drycleaning");

exports.signup = async (req, res) => {
  console.log("signup", req.body);
  try {
    const { phoneNumber, password, dob } = req.body;
    let check_user = await Auth.findOne({ phoneNumber });
    if (check_user)
      return res.json({
        success: false,
        error: "Phone number is already used",
      });
    const hashedPassword = passwordHash.generate(password);
    let newUser = new Auth({
      phoneNumber,
      password: hashedPassword,
      dob: dob,
      accountType: "user",
    });
    await newUser.save();
    return res.send({ success: true, msg: "User Registered Successfully" });
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { phoneNumber, password, dob } = req.body;
    let check_user = await Auth.findOne({ phoneNumber });
    const checkDob = JSON.stringify(dob)
      .toString()
      .localeCompare(JSON.stringify(check_user.dob).toString());
    if (checkDob != 0) {
      return res.status(422).send({
        success: false,
        error: [{ message: "Date Of birth Doesn't Match." }],
      });
    }
    if (check_user) {
      const hashedPassword = passwordHash.generate(password);
      check_user.password = hashedPassword;
      await check_user.save();
    }
    return res.send({
      success: true,
      msg: "Password Updated Sucessfully",
    });
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

exports.login = async (req, res) => {
  console.log("login", req.body);
  try {
    const {
      email,
      password,
      lat,
      lng,
      deviceId,
      deviceType,
      deviceToken,
      phoneNumber,
    } = req.body;
    if (!phoneNumber)
      return res.json({ success: false, error: "Phone number is required" });
    let user = await Auth.findOne({ phoneNumber });
    if (!user)
      return res.json({
        success: false,
        error: "Phone number is is not registered yet",
      });
    const verifyPassword = passwordHash.verify(password, user.password);
    if (!verifyPassword)
      return res.json({ success: false, error: "Invalid password" });
    if (user && user.accountStatus == "blocked")
      return res.json({ success: false, error: "Account blocked by admin" });
    ////await user.save();
    const payload = { id: user._id };
    // console.log("success jwt");
    let jwtToken = jwt.sign(payload, "password", { expiresIn: "365d" });
    console.log("success not jwt " + jwtToken);
    return res
      .status(200)
      .json({ success: true, msg: "Logged In", token: jwtToken });
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await Auth.findById(req.data.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const user = await Auth.find();
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

exports.updateMyProfile = async (req, res) => {
  console.log("updateMyProfile", req.body);
  try {
    const { firstName, lastName, email, country, state, pinCode, city } =
      req.body;
    const User = await Auth.findById(req.data.id);
    User.firstName = firstName;
    User.lastName = lastName;
    User.email = email;
    User.country = country;
    User.state = state;
    User.pinCode = pinCode;
    User.city = city;
    await User.save();
    if (User.isDryCleaner) {
      let model = await DryCleaning.findOne({ userId: req.data.id });
      model.merchantName = User.firstName + " " + User.lastName;
      model.merchantCity = User.city;
      await model.save();
    }
    return res.status(200).json({
      success: true,
      msg: "Your Profile has been updated successfully",
      data: User,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

exports.updateMyProfileImage = async (req, res) => {
  try {
    const User = await Auth.findById(req.data.id);
    if (req.files) {
      let profileImage = req.files.profileImage;
      let ext = profileImage.name.slice(profileImage.name.lastIndexOf("."));
      let userProfileImageName = randomstring.generate(15) + ext;
      let saveTo = path.join("./public/images/" + userProfileImageName.trim());
      profileImage.mv(saveTo, async function (err) {
        if (err) console.log(err);
        else {
          User.image = "/public/images/" + userProfileImageName;
          await User.save();
          console.log("saved");
          return res.status(200).json({
            success: true,
            msg: "Your Profile image has been updated successfully",
            imagePath: User.image,
          });
        }
      });
    } else
      return res
        .status(422)
        .send({ success: false, error: [{ message: "File Not Found" }] });
  } catch (error) {
    console.log(error.message);
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

exports.userFileUpload = async (req, res) => {
  try {
    if (req.files) {
      let profileImage = req.files.userFile;
      let ext = profileImage.name.slice(profileImage.name.lastIndexOf("."));
      let userProfileImageName = randomstring.generate(15) + ext;
      let saveTo = path.join("./public/images/" + userProfileImageName.trim());
      profileImage.mv(saveTo, async function (err) {
        if (err) console.log(err);
        else {
          return res.status(200).json({
            success: true,
            filePath: "/public/images/" + userProfileImageName,
          });
        }
      });
    } else
      return res
        .status(422)
        .send({ success: false, error: [{ message: "File Not Found" }] });
  } catch (error) {
    console.log(error.message);
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};
