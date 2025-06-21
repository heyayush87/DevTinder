const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();


const userschema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastname: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("enter a strong Password" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      set: (val) => val?.toLowerCase(),
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },

    photo: {
      type: String,
      default:
        "https://tse3.mm.bing.net/th?id=OIP.c2pNCKarFMQqCgZG7L5YNwHaHa&pid=Api&P=0&h=180",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("URL is not valid" + value);
        }
      },
    },
    about: {
      type: String,
    },
    Skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
userschema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7Days", // 7 days
  });
  return token;
}


userschema.methods.validatePassword =async  function (passwordInputByUser) {
  const user = this;
   // bcrypt.compare() returns a promise that resolves to true or false
      // if password matches then send success message
      // if password not matches then throw error
      // bcrypt.compare() takes two arguments, the password and the hashed password
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);
  return isPasswordValid;
}
module.exports = mongoose.model("User", userschema);