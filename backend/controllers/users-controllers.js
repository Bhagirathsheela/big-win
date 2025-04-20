//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require("uuid");
const HttpError = require('../models/http-error');

const User=require('../models/users');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'bhagi',
    email: 'test@test.com',
    password: 'testers'
  }
];

const getUsers =async (req, res, next) => {
  let users;
  try {
     users=  await User.find({},'-password')
  } catch (err) {
    const error= new HttpError("Fetching user failed, please try again later",500);
    return next(error);
  }
 //find returns array
  res.json({ users:users.map(user=>user.toObject({getters:true})) });
  //res.json({ users });
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  //const hasUser = DUMMY_USERS.find(u => u.email === email);
  let existingUser;
  try {
    existingUser = await User.findOne({email});
  } catch (err) {
    const error= new HttpError("Signup failed, please try again later",500);
    return next(error);
  }
  
  if (existingUser) {
    const error= new HttpError("User already exists, Please try with different credentials",422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:"abc",
    places:[],
    bets:[]
  });


  try {
    await createdUser.save();
  } catch (err) {
    const error= new HttpError("Creating user failed, please try again later",500);
    return next(error);
  }

  res.status(201).json({user: createdUser.toObject({getters:true})});
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({email});
  } catch (err) {
    const error= new HttpError("Login failed, please try again later",500);
    return next(error);
  }
  
  if(!existingUser||existingUser.password!==password){
    const error= new HttpError("Invalid credentials, please try again later",500);
    return next(error);
  }
 

  res.json({message: 'Logged in!',user:existingUser.toObject({getters:true})});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
