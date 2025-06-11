const express = require("express");
const requestRouter = express.Router();
const { userauth } = require("../middleware/auth");

requestRouter.get("/profile", userauth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
