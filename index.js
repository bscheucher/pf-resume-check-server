import "dotenv/config";
import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resumeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import session from "express-session";
import passport from "./config/passport.js";

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://pf-resume-check-client.onrender.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS")); // Reject the origin
    }
  },
  credentials: true, // Allow credentials (cookies, headers, etc.)
};

// Configure CORS
app.use(cors(corsOptions));

app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use("/resumes", resumeRoutes);
app.use("/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Resume AI Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
