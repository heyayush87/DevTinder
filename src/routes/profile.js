const express = require("express");
const requestRouter = express.Router();
const { userauth } = require("../middleware/auth");
const { ValidateEditProfileData } = require("../utils/validationn");

requestRouter.get("/profile/view", userauth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
requestRouter.patch("/profile/edit", userauth, async (req, res) => {
  try {
    if (!ValidateEditProfileData(req)) {
      throw new Error("Invalid fields for edit");
    }

    const loggedinUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedinUser.set(key, req.body[key]); // ✅ Use set to apply schema setters
    });

    await loggedinUser.save();

    res.send(loggedinUser);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});





module.exports = requestRouter;
