const express = require("express");
const mongoose = require("mongoose");
const { userauth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/users");

const requestRouter = express.Router();

// SEND CONNECTION REQUEST
requestRouter.post("/request/send/:status/:touserId", userauth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.touserId;
    const status = req.params.status;

    if (fromUserId.toString() === toUserId.toString()) {
      return res.status(400).send("You cannot send a request to yourself.");
    }

    const user = await User.findById(toUserId);
    if (!user) return res.status(404).send("Target user not found.");

    const validStatuses = ["ignore", "interested"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send("Invalid status.");
    }

    const existingRequest = await ConnectionRequest.findOne({
      fromUserId,
      toUserId,
    });
    if (existingRequest) {
      return res
        .status(400)
        .send("You have already sent a request to this user.");
    }

    const newRequest = new ConnectionRequest({ fromUserId, toUserId, status });
    const savedRequest = await newRequest.save();

    res.status(201).json({
      message: `${req.user.firstname} has ${status} ${user.firstname}.`,
      connectionData: savedRequest,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// REVIEW (ACCEPT/REJECT) CONNECTION REQUEST
requestRouter.post("/request/review/:status/:requestId", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .send("Invalid status. Use 'accepted' or 'rejected'.");
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).send("Connection request not found.");
    }

    connectionRequest.status = status;
    const updatedRequest = await connectionRequest.save();

    res.status(200).json({
      message: `You have ${status} the request.`,
      updatedRequest,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
