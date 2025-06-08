const express = require("express")
const connectDB=require("./Config/database");
const app = express();
const User = require("./models/users")
const {validateSignUpData} = require("./utils/validationn");
const bcrypt=require("bcrypt")
app.use(express.json());

// add data to database 
app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstname , lastname , emailId ,password } = req.body;
    const passwordhash = await bcrypt.hash(password, 10);
    console.log(passwordhash);
    
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
    const {emailId,password}=req.body
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    
    const isPassword = await bcrypt.compare(password, user.password)
    if (isPassword) {
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
// get any user data
app.get("/user", async (req, res) => {
    const useremail = req.body.emailId;
     try {
        const user = await User.find({emailId : useremail});
        if (user.length===0) {
            res.status(404).send("user  not found");
        }
        else {
            res.send(user)
        }
    }
    catch(err) {
        res.status(400).send("something went wrong"+err.message);
    }
})

//  get all user data
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
   
    res.status(500).send("Something went wrong"+error.message);
  }
});
  
// delete user by id
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send("User deleted successfully");
  } catch (err) {
   
    res.status(500).send("Something went wrong"+err.message);
  }
});
  
// update data using patch
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photo", "about", "gender", "age", "Skills"];

   
    const isUpdatedAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdatedAllowed) {
      return res.status(400).send("Error: update not allowed");
    }

   
    if (data.Skills && data.Skills.length > 10) {
      return res.status(400).send("Error: Skills should not be more than 10");
    }

    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });

    res.send("User data updated successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


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
 

  




