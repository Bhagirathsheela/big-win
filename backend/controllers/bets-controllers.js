
const { default: mongoose } = require('mongoose');
const HttpError = require('../models/http-error');

const Bet=require('../models/bet')
const User=require("../models/user")
const { formatDate } = require("../utils");

//create Bet
const createBetByUserId = async (req, res, next) => {
  const { selectedBet } = req.body;
  //console.log("req body", req.body,req.userData);
  // const title = req.body.title;
  const createdBet = new Bet({
    selectedBet,
    creator:req.userData.userId,
    date: formatDate(Date.now()),
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Creating bet failed", 500);
    return next(err);
  }

  if (!user) {
    const error = new HttpError("Couldn't find user for provided id", 404);
    return next(error);
  }
  //console.log("user",user);
   if (user.id.toString() !== req.body.creator) {
    const error = new HttpError("You are not allowed to add this bet.", 401);
    return next(error);
  } 

  try {
    //await createdPlace.save();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdBet.save({ session: sess });
    // here push is not js push, it's mongoose push method which kind of allow mongoose to make a relation between 2 models (between user and places).
    //here mongoose grabs the created place id and add it to the places field of user
    user.bets.push(createdBet);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating bet failed", 500);
    return next(err);
  }

  res.status(201).json({ bet: createdBet });
};


/* exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId; */
exports.createBetByUserId = createBetByUserId;
/* exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace; */
