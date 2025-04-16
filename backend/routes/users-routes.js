const express =require("express");

const usersController = require("../controllers/users-controllers");

const router=express.Router();
const HttpError = require("../models/http-error");


router.get("/", usersController.getUsers);

router.post("/signup", usersController.signup);

router.post("/login", usersController.login);

module.exports=router