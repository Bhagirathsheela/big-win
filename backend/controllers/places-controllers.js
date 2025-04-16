
const { default: mongoose } = require('mongoose');
const HttpError = require('../models/http-error');

const Place=require('../models/place')
const User=require("../models/users")

/* let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
]; */

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  let place;
  try {
   place = await Place.findById(placeId)
  } catch (err) {
     //const error = new HttpError('Something went wrong, please try later',500);
     return next(err)
  }

  if (!place) {
    const error= new HttpError('Could not find a place for the provided id.', 404);
    return next(error)
  }

  res.json({ place:place.toObject({getters:true}) }); // => { place } => { place: place }
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  //let places;
   let userWithPlaces;
  try {
    //places= await Place.find({ creator: userId})
    userWithPlaces = await User.findById(userId).populate("places"); 
  } catch (err) {
    const error= new HttpError(err)
    return next(err)  
  }
  

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const { title, description,location, address, creator } = req.body;
  // const title = req.body.title;
  const createdPlace = new Place({
    title,
    description,
    address,
    location,
    image:
      "https://fastly.picsum.photos/id/805/200/200.jpg?hmac=_YsptA4tmhnOwjWiLyYwiOuvOs30wULvKSLP6KESMg0",
    creator,
  });


  let user;
  try {
    user=await User.findById(creator)
  } catch (err) {
    const error = new HttpError("creating places failed",500);
    return next(err); 
  }
  
  if(!user){
    const error = new HttpError("couldn't find user for provided id",404);
    return next(error); 
  }

  try {
    //await createdPlace.save();
    const sess= await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({session:sess});
    // here push is not js push, it's mongoose push method which kind of allow mongoose to make a relation between 2 models (between user and places).
    //here mongoose grabs the created place id and add it to the places field of user
    user.places.push(createdPlace);
    await user.save({session:sess});
    await sess.commitTransaction(); 


  } catch (err) {
    const error = new HttpError("Creating places failed",500);
    return next(err);
  }
   
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
   place = await Place.findById(placeId)
  } catch (err) {
     //const error = new HttpError('Something went wrong, please try later',500);
     return next(err)
  }
  place.title = title;
  place.description = description; 

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("updating place failed",500);
    return next(err);
  }
   
  res.status(200).json({ place: place.toObject({getters:true}) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place= await Place.findById(placeId).populate('creator');
    //console.log(place)
  } catch (err) {
    const error = new HttpError("something wrong",500);
    return next(error);
  }

  if(!place){
    const error = new HttpError("Couldn't find place with the given Id",404);
    return next(error);
  }

  try {
   
    const sess= await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({session:sess})
    place.creator.places.pull(place._id);
    place.creator.save({session:sess})
    await sess.commitTransaction(); 

  } catch (err) {
    const error = new HttpError("delete place failed",500);
    return next(error);
  }
  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
