const express = require("express");
const userRouter= express.Router();
const { userauth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/users");

userRouter.get("/user/request/received", userauth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequestId = await ConnectionRequest.find({
          toUserId: loggedInUser._id,
          status: "interested",
        })
          .populate(
            "fromUserId",
            "firstname lastname photo age gender about Skills"
          )
         
          
        console.log("connectionRequestId", connectionRequestId);

        if (connectionRequestId.length === 0) {
            return res.status(404).send("No connection requests found");
        }
        res.json({
            message: "Connection requests fetched successfully",
           data: connectionRequestId
        })
    }
    catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

// Make Api  for see current connection
userRouter.get("/user/connection", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserId",
        "firstname lastname photo age gender about Skills"
      )
      .populate(
        "toUserId",
        "firstname lastname photo age gender about Skills"
      );
        
    const data = connectionRequests.map((key) => {
      if (key.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return key.toUserId
      }
      return key.fromUserId
    });
  

          res.json({
              message: "Connection request fetched successfully",
                data: data,
            
          });
    }
    catch (err) {
        res.status(500).send("error is :" + err.message)
    }
});

userRouter.get("/user/feed", userauth, async (req, res) => {
  const page= parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10; 
  limit>50?50:limit

  const skip = (page - 1) * limit;
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideuserFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideuserFromFeed.add(request.fromUserId.toString());
      hideuserFromFeed.add(request.toUserId.toString());
      
    })
    c

    const feeddata = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideuserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ]
    }).select("firstname lastname photo age gender about Skills").skip(skip).limit(limit)
    res.status(200).json({
     message: "Feed data fetched successfully",
     data: feeddata,
    });
  }
  catch(err) {
      res.status(500).send("error is :" + err.message)
  }
});
module.exports= userRouter;