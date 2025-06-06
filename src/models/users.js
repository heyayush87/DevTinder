const mongoose = require("mongoose")
const userschema = new mongoose.Schema({
    firstname: {
        type:String,
    },
    lastname: {
        type:String,
    },
    emailId: {
        type:String,
    },
    password: {
        type:String,
    },
    age: {
        type:Number,
    },
    gender: {
        type:String,
    },
})
module.exports = mongoose.model("User", userschema);