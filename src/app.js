const express = require("express")
const connectDB=require("./Config/database");
const app = express()
const User = require("./models/users")

app.post("/signup", async (req, res) => {
    const user = new User({
        firstname: "Vaibhav",
        lastname: "chuttani",
        emailId: "vaibhav0709@gmail.com",
        password:"heyvaibhav",
        age: 23,
    });
    await user.save();
    res.send("user created successfully")

})
connectDB()
  .then(() => {
      console.log("databse connected");
      app.listen(3000, () => {
        console.log("hello from port 3000");
      });
  })
  .catch((err) => {
    console.lerror("databse doesnt connected");
  });
 

  




