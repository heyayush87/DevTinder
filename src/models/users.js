const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const userschema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength:50,
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
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photo: {
      type: String,
      default:
        "https://www.shutterstock.com/shutterstock/photos/2534623311/display_1500/stock-vector-default-avatar-profile-icon-transparent-png-social-media-user-png-icon-whatsapp-dp-isolated-on-2534623311.jpg",
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
  const token = await jwt.sign({ _id: user._id }, "@DevTinder09", {
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