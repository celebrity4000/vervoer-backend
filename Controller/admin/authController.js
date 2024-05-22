const Auth = require("../../Model/Auth");
const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
const keys = require("../../Config/config");
const randomstring = require("randomstring");
const path = require("path");

exports.signup = async (req, res) => {
  console.log("signup", req.body);
  try {
    const { email, password, firstName, lastName } = req.body;
    let accountType = "admin";
    const hashedPassword = passwordHash.generate(password);
    let adminData = await Auth.findOne({ email, accountType });
    if (!adminData)
      adminData = new Auth({
        email,
        password: hashedPassword,
        accountType,
        firstName,
        lastName,
      });
    await adminData.save();
    return res.send({
      success: true,
      msg: "Admin Registered Successfully",
      data: adminData,
    });
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};

exports.login = async (req, res) => {
  console.log("admin login", req.body);
  try {
    const { email, password } = req.body;
    const accountType = "admin";
    if (!email)
      return res
        .status(422)
        .json({ success: false, error: [{ message: "Email is required" }] });
    let user = await Auth.findOne({ email, accountType });
    if (!user)
      return res.status(422).json({
        success: false,
        error: [{ message: "Invalid admin email credential" }],
      });
    const verifyPassword = passwordHash.verify(password, user.password);
    if (!verifyPassword)
      return res.status(422).json({
        success: false,
        error: [{ message: "Invalid admin password credential" }],
      });
    const payload = { id: user._id };
    let jwtToken = jwt.sign(payload, keys.secretOrKey, { expiresIn: "365d" });
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
    // const user = await Auth.findById(req.data.id);
    // if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ success: true, data: req.data });
  } catch (error) {
    return res.status(422).send({
      success: false,
      error: [{ message: error.message }],
    });
  }
};
