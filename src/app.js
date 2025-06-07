const express = require("express")
const connectDB=require("./Config/database");
const app = express()
const User = require("./models/users")

app.use(express.json());

// add data to database 
app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {

    res
      .status(400)
      .send("Something went wrong while creating the user" + err.message);
  }
});

  
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
        res.status(400).send("something went wrong");
    }
})

//  get all user data
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Something went wrong");
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
   
    res.status(500).send("Something went wrong");
  }
});
  
// update data using patch
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photo", "about", "gender", "age", "Skills"];

    // ✅ Corrected .every() check with return
    const isUpdatedAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdatedAllowed) {
      return res.status(400).send("Error: update not allowed");
    }

    // ✅ Check if Skills exists and is too long
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
    console.lerror("databse doesnt connected");
  });
 

  




