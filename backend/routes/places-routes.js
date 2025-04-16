const express =require("express");

const placesController = require("../controllers/places-controllers");

const router=express.Router();
const HttpError = require("../models/http-error");


router.post("/", placesController.createPlace);
router.get("/:pid", placesController.getPlaceById);
router.get("/user/:uid", placesController.getPlacesByUserId);
router.patch("/:pid", placesController.updatePlace);
router.delete("/:pid", placesController.deletePlace);
module.exports=router