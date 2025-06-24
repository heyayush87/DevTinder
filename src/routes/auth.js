const express = require("express");


const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validationn");

const User = require("../models/users");
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstname, lastname, emailId, password } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("Email already exists");
    }

    const passwordhash = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      emailId,
      password: passwordhash,
    });

    await user.save();

    //  Create and set JWT token in cookie
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token)
      .status(201)
      .send({ message: "User created", data: user }); // frontend expects `data`
  } catch (err) {
    res
      .status(400)
      .send("Something went wrong while creating the user: " + err.message);
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
      if (!token) {
        return res.status(401).send("Access Denied");
      }

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true on Render
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      const safeUser = {
        firstname: user.firstname,
        lastname: user.lastname,
        emailId: user.emailId,
        photo: user.photo,
        age: user.age,
        gender: user.gender,
        about: user.about,
        Skills: user.Skills,
        _id: user._id, // include if needed on frontend
      };

      res.status(200).send({ data: safeUser });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
}); 
  
authRouter.post("/logout", async (req, res) => {
  try {
    // clear the cookie
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      expires: new Date(0), // ✅ clear immediately
    });
    
    
      res.send("Logout Successful");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = authRouter;