const express = require("express");
const mongoose = require("mongoose");
const { userauth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User=require("../models/users");

const requestRouter = express.Router()
// Make Api for sending connection request
requestRouter.post(
  "/request/send/:status/:touserId",
  userauth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.touserId;
      const status = req.params.status;

      // Validate user
      const user = await User.findById(toUserId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Validate status
      const validStatuses = ["ignore", "interested"];
      if (!validStatuses.includes(status)) {
        return res
          .status(400)
          .send("Invalid status. Must be one of 'ignore', 'interested'");
      }

     
      // Check for existing active connection request
      const existingRequest = await ConnectionRequest.findOne({
        fromUserId,
        toUserId,
        status: { $in: ["interested", "pending"] }, // Optional: Add your own valid statuses
      });

      if (existingRequest) {
        return res
          .status(400)
          .send("You have already sent a connection request to this user.");
      }

      // Save new request
      const newRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const connectionData = await newRequest.save();

      res.status(201).send({
        message: `${req.user.firstname} has ${status} ${user.firstname}.`,
        connectionData,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);


// Make Api for getting all connection requests
requestRouter.post(
  "/request/review/:status/:requestId",
  userauth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .send("Invalid status. Must be one of 'accepted', 'rejected'");
      }

      // Find the connection request
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).send("Connection request not found");
      }

      connectionRequest.status = status;
      const updatedRequest = await connectionRequest.save();

      res.status(200).send({
        message: `Request has been ${status} by ${loggedInUser.firstname}.`,
        updatedRequest,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;