const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");
const betsRoutes = require("./routes/bets-routes");
const HttpError = require("../backend/models/http-error");
const mongoose = require("mongoose");
require("./scheduler");

const app = express();

app.use(bodyParser.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// Allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE"
  );
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/bets", betsRoutes);

// Handle 404
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// Error handler
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

// MongoDB connection (only connect once, when Vercel starts the function)
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bxc5w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    );
    isConnected = true;
    console.log("Connected to MongoDB.");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}

// Export the app and DB connection wrapper
module.exports = { app, connectToDatabase };
