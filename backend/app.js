// ---- Env bootstrap ----------------------------------------------------
// Load env from nodemon.json so the server works whether you launch with
// `npm start` (plain node) or `npm run dev` (nodemon). Real env vars set
// by the hosting platform (Render/Vercel/etc.) always take precedence.
(function loadEnvFallback() {
  try {
    const fs0 = require("fs");
    const path0 = require("path");
    const nmPath = path0.join(__dirname, "nodemon.json");
    if (!fs0.existsSync(nmPath)) return;
    const nm = JSON.parse(fs0.readFileSync(nmPath, "utf8"));
    if (!nm || !nm.env) return;
    let added = 0;
    for (const [k, v] of Object.entries(nm.env)) {
      if (process.env[k] === undefined || process.env[k] === "") {
        process.env[k] = String(v);
        added++;
      }
    }
    if (added) console.log(`[env] loaded ${added} var(s) from nodemon.json`);
  } catch (e) {
    console.warn("[env] could not read nodemon.json:", e.message);
  }
})();
// -----------------------------------------------------------------------

const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");
const betsRoutes = require("./routes/bets-routes");
const lotteryRoutes = require("./routes/lottery-routes");
const HttpError = require("./models/http-error");
require("./scheduler");

const app = express();

app.use(bodyParser.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PATCH, PUT, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/bets", betsRoutes);
app.use("/api/lottery", lotteryRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.log(err);
    });
  }
  if (res.headerSent) return next(error);
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bxc5w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ Server not connected =>=>=>=> " + err);
  });
