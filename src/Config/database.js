const mongoose = require("mongoose")
const connectDB = async () => {
    await mongoose.connect(
      "mongodb+srv://heyayush0709:9Q2IDGDX6O8YAdPF@cluster0.1qj4ltv.mongodb.net/"
    );
}
module.exports=connectDB
