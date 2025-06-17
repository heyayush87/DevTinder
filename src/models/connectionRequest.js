const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ignore", "interested", "accepted", "rejected"],
      message:
        "Status must be one of 'ignore', 'interested', 'accepted', or 'rejected'",
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });


// create pre-save hook to validate the fromUserId and toUserId
connectionRequestSchema.pre("save", async function (next) {
   const connectionRequest = this;
   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannont send a connection request to yourself");
    }
    next();
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports = ConnectionRequest