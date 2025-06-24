require("dotenv").config();
const express = require("express");
const connectDB = require("./Config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Simple origin check for single allowed origin
const allowedOrigin = "https://dev-tinder-frontend-mu.vercel.app";

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// ✅ Apply CORS and preflight
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight

app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/request"));
app.use("/", require("./routes/user"));

// DB + Server
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
