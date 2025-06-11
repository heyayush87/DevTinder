const express = require("express");
const { userauth } = require("../middleware/auth");

const requestRouter = express.Router()
requestRouter.get("/sendingconnection", userauth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
}
);
module.exports = requestRouter;