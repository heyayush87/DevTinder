require("dotenv").config();

const express = require("express");
const connectDB = require("./Config/database");
const cors = require("cors");
const cookieparser = require("cookie-parser");

const app = express();

const allowedOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const originHost = origin.replace(/^https?:\/\//, "").split("/")[0];
    const isAllowed = allowedOrigins.some((allowed) => {
      const allowedHost = allowed.replace(/^https?:\/\//, "").split("/")[0];
      return originHost === allowedHost;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`CORS blocked for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposedHeaders: ["Set-Cookie"],
};

// ✅ Apply CORS to all routes
app.use(cors(corsOptions));

// ✅ This is optional and generally not needed if above is correct
// app.options("/*", cors(corsOptions));

// ✅ Custom CORS headers (optional)
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(cookieparser());

// ROUTES
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// ✅ Use only one base path if possible
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// DB + Server
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    console.log("database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
