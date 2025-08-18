const express = require('express');
const fs = require("fs");
const path = require('path')
const bodyParser = require("body-parser");
require('dotenv').config();
const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");
const betsRoutes = require("./routes/bets-routes");
const lotteryRoutes = require("./routes/lottery-routes");
const HttpError= require("./models/http-error");
const { default: mongoose } = require("mongoose");
require('./scheduler');

const app = express();
 

app.use(bodyParser.json());
app.use('/uploads/images',express.static(path.join('uploads','images')));

// uncomment below code for combined app
//app.use(express.static(path.join("public")));

// comment below code for combined
 app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  res.setHeader("Access-Control-Allow-Methods", 'GET, POST,PATCH, PUT, DELETE');
  next()
}); 

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/bets", betsRoutes);
app.use("/api/lottery", lotteryRoutes);

/* un comment it for combined backend front end app, 
create a public folder in backend and put build folder in it */
 /* app.use((req, res, next) => {
 res.sendFile(path.resolve(__dirname,"public","index.html"))
}); */

// comment below part for combined app
 app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
}); 

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
//mongodb+srv://bhagirath:bhagiraths@cluster0.bxc5w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
/* mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bxc5w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("connected to server");
    app.listen(process.env.PORT||5000);
  })
  .catch((err) => {
    console.log(err);
  }); */
  const PORT = process.env.PORT || 5000;

  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bxc5w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    )
    .then(() => {
      app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
      });
    }).catch((err) => {
      console.log("Server not connected "+" "+err);
    });


