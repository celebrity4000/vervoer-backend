require("dotenv").config();
const jwt = require("jsonwebtoken");
const keys = require("../Config/config");
const Auth = require('../Model/Auth');

module.exports = middlewares = {
  authenticateToken: async (req, res, next) => {
    let authorization = req.header('Authorization');
    if(!authorization) return res.status(401).json({ error: [{message: "Token not found"}] });
    try {
        authorization = authorization.split(" ");
        const token = authorization[1];

        const data = jwt.verify(token, keys.secretOrKey);
        if (!data) return res.status(401).json({ error: "Invalid token" });
        let adminData = await Auth.findById(data.id);
        req.data = adminData;
        next();
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
};

