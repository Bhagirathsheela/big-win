//const http = require("http")
const express = require("express");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");
const betsRoutes = require("./routes/bets-routes");
const HttpError= require("../backend/models/http-error");
const { default: mongoose } = require("mongoose");
require('./scheduler');

const app = express();
 

app.use(bodyParser.json());
app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  res.setHeader("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE');
  next()
})

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/bets", betsRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});
//mongodb+srv://bhagirath:bhagiraths@cluster0.bxc5w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose
  .connect(
    "mongodb+srv://bhagirath:bhagiraths@cluster0.bxc5w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("connected to server")
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

