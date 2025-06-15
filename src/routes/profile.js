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
        loggedinUser[key] = req.body[key];
      });
      await loggedinUser.save();
      res.send("Profile updated successfully"); 
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
}
)

module.exports = requestRouter;
