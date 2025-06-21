const express = require("express");
const profileRouter = express.Router(); // ✅ name should match

const { userauth } = require("../middleware/auth");
const { ValidateEditProfileData } = require("../utils/validationn");

profileRouter.get("/profile/view", userauth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userauth, async (req, res) => {
  try {
    if (!ValidateEditProfileData(req)) {
      throw new Error("Invalid fields for edit");
    }

    const loggedinUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedinUser.set(key, req.body[key]);
    });

    await loggedinUser.save();
    res.send(loggedinUser);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter; // ✅ This will now work
