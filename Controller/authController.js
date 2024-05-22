const Auth = require("../Model/Auth");
const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
const Validator = require("../Utilities/validator");
const { otpGenerator, fast2sms } = require("../Utilities/helpers");
const Merchant = require("../Model/Merchant");
const keys = require("../Config/config");
const qrcode = require("qrcode");
const sendMail = require("../Common/sendEmail");
const moment = require("moment");

exports.inValid = async (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Invalid Path",
  });
};
/**
 * Used for user registration
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.signup = async (req, res, next) => {
  try {
    console.log("signup", req.body);
    const { phoneNumber, password } = req.body;
    let check_user = await Auth.findOne({ phoneNumber });
    if (check_user)
      return res
        .status(409)
        .json({
          success: false,
          error: "Phone number is already registered",
          userData: check_user._id,
        });
    const hashedPassword = passwordHash.generate(password);
    const otp = 1234;
    //const otp = otpGenerator(4);
    fast2sms(
      {
        message: `Your OTP is ${otp}`,
        contactNumber: phoneNumber,
      },
      next
    );
    // For Deployment
    const qrData = { phoneNumber };
    let strData = JSON.stringify(qrData);
    const generateQR = await qrcode.toDataURL(strData);
    let new_user = new Auth({
      phoneNumber,
      password: hashedPassword,
      otp,
      qrCode: generateQR,
      accountType: "user",
    });
    const save = await new_user.save();
    const payload = {
      id: new_user._id,
      phoneNumber: `${new_user.phoneNumber}`,
    };
    let token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 });
    // For development & testing
    // qrcode.toString(strData, {type:'terminal'},
    //                     function (err, code) {
    //     if(err) return err.message;
    // });
    return res.send({
      success: true,
      msg: "Details saved",
      data: { user: save, token },
    });
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    const check_user = await Auth.findOne({ phoneNumber });
    if (check_user) {
      const deleteStatus = await Auth.deleteOne({ phoneNumber });
      console.log(deleteStatus);
      return res.send({ success: true, msg: "Suceessfuly deleted" });
    } else {
      return res.send({ success: false, msg: "Delete User Failed" });
    }
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};
/**
 * Used for user login
 * @param {*} req
 * @param {*} res
 * @returns
 */
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
    if (!email && !phoneNumber)
      return res
        .status(404)
        .json({ error: "Email or Phone Number is required" });
    let user;
    if (email) user = await Auth.findOne({ email });
    if (phoneNumber) user = await Auth.findOne({ phoneNumber });
    if (!user)
      return res.status(404).json({ error: "Email or Phone not found" });
    const verifyPassword = passwordHash.verify(password, user.password);
    if (!verifyPassword)
      return res.status(403).json({ error: "Invalid Password" });
    //// if(!user.isPhoneVerified) return res.status(403).json({ error: "Your Phone is not verified yet" });
    //// if(!user.isEmailVerified) return res.status(403).json({ error: "Your Email is not verified yet" });
    user.email = email || user.email;
    user.coordinates = { lng, lat };
    user.devices = { deviceId, deviceType, token: deviceToken };
    await user.save();

    const payload = {
      id: user._id,
      name: `${user.firstName}`,
      email: user.email ? user.email : "",
    };
    let jwtoken = jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 });
    return res
      .status(200)
      .json({
        success: true,
        msg: "Logged In",
        data: { token: jwtoken, user },
      });
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

exports.data = async (req, res) => {
  console.log("Working");
  res.send({
    success: true,
  });
};

/**
 * Used for phone number otp verification
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.phoneOtpVerification = async (req, res, next) => {
  try {
    const isUser = await Auth.findById({ _id: req.body.userId }).exec();
    if (!isUser) return next(new Error("user does not exist"));
    if (isUser.otp == req.body.otp) {
      isUser.isPhoneVerified = true;
      await isUser.save();
      var userdata = await Auth.findOne({ _id: isUser._id })
        .select("-password -devices -otp")
        .exec();
      return res.status(200).json({
        success: true,
        data: userdata,
        msg: "You are now a verified user",
      });
    } else {
      return res
        .status(404)
        .json({ error: "OTP not matched..Please enter valid otp" });
    }
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

/**
 * Used for phone number verification
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.emailOtpVerification = async (req, res, next) => {
  try {
    const isUser = await Auth.findById({ _id: req.body.userId }).exec();
    if (!isUser) return next(new Error("user does not exist"));
    if (isUser.otp == req.body.otp) {
      isUser.isEmailVerified = true;
      await isUser.save();
      const userdata = await Auth.findOne({ _id: isUser._id })
        .select("-password -devices -otp")
        .exec();
      const payload = {
        id: isUser._id,
        name: `${isUser.firstName}`,
        email: isUser.email ? isUser.email : "",
      };
      let jwtoken = jwt.sign(payload, keys.secretOrKey, {
        expiresIn: 31556926,
      });
      return res.status(200).json({
        success: true,
        data: { user: userdata, token: jwtoken },
        msg: "Email has been verified successfully",
      });
    } else {
      return res.status(404).send({
        success: false,
        error: "OTP not matched..Please enter valid otp",
      });
    }
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

exports.resendPhoneOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await Auth.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ error: "User not found" });
    //const otp = otpGenerator(4);
    const otp = 1234;
    user.otp = otp;
    await user.save();
    //  sent OTP
    await fast2sms(
      {
        message: `Your OTP is ${otp}`,
        contactNumber: phoneNumber,
      },
      next
    );
    return res.status(200).json({ success: true, msg: "OTP sent" });
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

exports.resendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Auth.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    //const otp = otpGenerator(4);
    const otp = 1234;
    user.otp = otp;
    await user.save();
    //  sent OTP
    const subject = "Email Authentication";
    const text = "Your otp is " + otp;
    await sendMail(email, subject, text);
    return res.status(200).json({ success: true, msg: "OTP sent" });
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

exports.socialLogin = async (req, res) => {
  try {
    let { type, socialId, lat, lng, deviceId, deviceType, token } = req.body;

    if (type === "facebook") {
      var user = await Auth.findOne({
        "socialId.facebook": socialId,
      }).exec();
      if (!user) {
        return res.status(404).json({ error: "User id not found" });
      }
    }

    if (type === "google") {
      var user = await Auth.findOne({
        "socialId.google": socialId,
      }).exec();
      if (!user) {
        return res.status(404).json({ error: "User id not found" });
      }
    }

    const payload = {
      id: user._id,
      firstName: `${user.firstName}`,
    };

    let jwtoken = jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 });

    user.coordinates = {
      lat,
      lng,
    };

    user.devices = {
      deviceId,
      deviceType,
      token,
    };

    await user.save();

    return res
      .status(200)
      .json({ success: true, data: { user, token: jwtoken } });
  } catch (error) {}
};

/**
 * Used for profile update
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.profileSetup = async (req, res) => {
  console.log("profileSetup", req.body);
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

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, country, state, zipcode } = req.body;
    const User = await Auth.findOne({ _id: req.data.id });
    User.firstName = firstName;
    User.lastName = lastName;
    User.email = email;
    User.country = country;
    User.state = state;
    User.zipcode = zipcode;
    //   walker.basicInfo.image = req.files && req.files.image && keys.apiURL + req.files.image[0].filename || keys.apiURL + "default.png",
    //   walker.basicInfo.photoId = req.files && req.files.photoId && keys.apiURL + req.files.photoId[0].filename || keys.apiURL + "default.png";
    //   walker.basicInfo.insuranceProof = req.files && req.files.insuranceProof&& keys.apiURL + req.files.insuranceProof[0].filename || keys.apiURL + "default.png";
    const otp = otpGenerator(4);
    const subject = "Email Authentication";
    const text = "Your otp is " + otp;
    const isSent = await sendMail(email, subject, text);
    if (isSent) {
      const save = await User.save();
      return res.status(200).json({
        success: true,
        msg: "Your Profile hasbeen updated successfully",
        data: { User: save },
      });
    }
    return res.status(200).json({
      success: false,
      msg: "Sorry! Your mail is not verified",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Used to fetch a user profile data
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getProfile = async (req, res) => {
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

exports.forgotPassword = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    const user = await Auth.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ error: "User not found" });
    const otp = otpGenerator(4);
    user.forgotPasswordToken = {
      token: otp,
      validTill: moment().add(2, "hours"),
    };

    const sendSms = await fast2sms(
      {
        message: `Your OTP is ${otp}`,
        contactNumber: phoneNumber,
      },
      next
    );
    const updateUser = await user.save();
    res.send({
      success: true,
      msg: "OTP has been sent on your phone",
    });
  } catch (error) {
    console.log("ererrr", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { new_password, old_password } = req.body;
    const user = await Auth.findOne({ _id: req.data.id });
    if (!user) return res.status(404).json({ error: "User not found" });
    const verify = passwordHash.verify(old_password, user.password);
    if (!verify)
      return res
        .status(404)
        .json({ error: "Your old password is not correct !" });
    const hashedPassword = passwordHash.generate(new_password);
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .json({ success: true, msg: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { otp, new_password } = req.body;
    const user = await Auth.findOne({ _id: req.data.id });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.forgotPasswordToken && user.forgotPasswordToken.token) {
      if (user.forgotPasswordToken.token !== otp) {
        return res.status(400).json({ error: "Incorrect OTP" });
      }
      if (moment().isAfter(user.forgotPasswordToken.validTill)) {
        return res
          .status(401)
          .json({ error: "OTP expired. Please generate a new one." });
      }
    } else {
      return res
        .status(404)
        .json({ error: "Token not found. You cannot change your password" });
    }
    const hashedPassword = passwordHash.generate(new_password);
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .json({ success: true, msg: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
