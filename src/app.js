const express = require("express")
const connectDB=require("./Config/database");
const app = express();
const cors= require("cors");


app.use(
  cors({
    origin: process.env.CLIENT_URL, // Replace with your frontend URL
    credentials: true,
  })
);
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

const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
      console.log("databse connected");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
  })
  .catch((err) => {
    console.error("databse doesn't connected");
  });
 

  




