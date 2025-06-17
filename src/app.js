const express = require("express")
const connectDB=require("./Config/database");
const app = express();

// Middleware to parse cookies
const cookieparser = require("cookie-parser")

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cookieparser())




const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");  
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");


 app.use("/", authRouter);
app.use("/", profileRouter); 
app.use("/", requestRouter);
app.use("/", userRouter);

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
 

  




