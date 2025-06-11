const express = require("express");

const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validationn");

const User = require("../models/users");
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstname, lastname, emailId, password } = req.body;
    const passwordhash = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      emailId,
      password: passwordhash,
    });
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res
      .status(400)
      .send("Something went wrong while creating the user" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    // first take email and password  from  req body
    // then find user by email
    // if user not found then throw error
    //  if user found then compare password
    // if password matches then send success message
    // if password not matches then throw error
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    // compare password
    // validatePassword is a method in the User model that compares the password
    // bcrypt.compare() returns a promise that resolves to true or false
    // if password matches then send success message
    // if password not matches then throw error

    const isPassword = await user.validatePassword(password);
    if (isPassword) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
}); 
  

module.exports = authRouter;