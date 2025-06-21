
require("dotenv").config();

const express = require("express");
const connectDB = require("./Config/database");
const cors = require("cors");

const app = express();



const allowedOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Allow credentials explicitly
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


// Middlewares
const cookieparser = require("cookie-parser");
app.use(express.json());
app.use(cookieparser());

// Routes
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
