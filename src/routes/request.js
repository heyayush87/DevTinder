const express = require("express");
const { userauth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User=require("../models/users");

const requestRouter = express.Router()
requestRouter.post("/request/send/:status/:touserId", userauth, async (req, res) => {
    try {
        const fromuserId = req.user._id;
        const touserId = req.params.touserId;  // Assuming touserId is passed as a URL parameter
        const status = req.params.status; // Default status for the request

        //  check if user is present in our db so hacker dont send request to any random user
        const user=await User.findById(touserId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Validate status
        const validStatuses = ["ignore", "interested"];
        if (!validStatuses.includes(status)) {
            return res.status(400).send("Invalid status. Must be one of 'ignore', 'interested'");
        }       


           // Check if the connection request already exists  
        const existingRequest = await ConnectionRequest.findOne({
          $or: [
            { fromuserId, touserId },

            {
              fromUserId: touserId,
              toUserId: fromuserId,
            },
          ],
        });
        if (existingRequest) {
            return res.status(400).send("Connection request already exists");
        }
        const newRequest = new ConnectionRequest({
            fromUserId: fromuserId,
            toUserId: touserId,
            status: status,
        });
        const connectionData = await newRequest.save();
        res.status(201).send({
          message:
            req.user.firstname + " is  " + status + " in " + user.firstname,
          connectionData,
        });
        
        
        
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
}
);
module.exports = requestRouter;