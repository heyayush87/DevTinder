const jwt = require("jsonwebtoken");
const User = require("../models/users");
require("dotenv").config();
const userauth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send("Access denied. No token provided.");
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.ststus(404).send("User not found");
        }
        req.user = user;
        next();
    }
 catch (err) {
    return res.status(400).send("Error: " + err.message);
  }
  

}
module.exports = {userauth, };