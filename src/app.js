const express = require("express")
const connectDB=require("./Config/database");
const app = express();
const User = require("./models/users")
const { validateSignUpData } = require("./utils/validationn");
const { userauth } = require("./middleware/auth");
const bcrypt = require("bcrypt")
const cookieparser = require("cookie-parser")
const jwt= require("jsonwebtoken")
app.use(express.json());
app.use(cookieparser())

// add data to database 
app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstname , lastname , emailId ,password } = req.body;
    const passwordhash = await bcrypt.hash(password, 10);
   
    
    const user = new User({
      firstname,lastname,emailId,password:passwordhash
    });
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {

    res
      .status(400)
      .send("Something went wrong while creating the user" + err.message);
  }
});

// Login Api
app.post("/login", async (req, res) => {
  try {
    // first take email and password  from  req body
    // then find user by email
    // if user not found then throw error
    //  if user found then compare password
    // if password matches then send success message
    // if password not matches then throw error
    const {emailId,password}=req.body
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    // compare password
    // bcrypt.compare() returns a promise that resolves to true or false
    // if password matches then send success message
    // if password not matches then throw error
    // bcrypt.compare() takes two arguments, the password and the hashed password
    const isPassword = await bcrypt.compare(password, user.password)
    if (isPassword) {
      const token = jwt.sign({ _id: user._id }, "@DevTinder09", {
        expiresIn: "7Days", // 7 days
      });
     
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days 
   
      })
      res.send("Login Successful")
    }
    else{
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res
      .status(400)
      .send("Error : " + err.message);
  }
}) 
  
// Profile  Api
app.get("/profile",userauth, async (req, res) => {
  try {
    const user=req.user
    res.send(user)
    }
   catch (err) {
    res.status(400).send("Error: " + err.message);
  }
  
})


connectDB()
  .then(() => {
      console.log("databse connected");
      app.listen(3000, () => {
        console.log("hello from port 3000");
      });
  })
  .catch((err) => {
    console.error("databse doesn't connected");
  });
 

  




