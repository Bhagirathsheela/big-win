const express =require("express");

const betsController = require("../controllers/bets-controllers");

const router=express.Router();

router.post("/", betsController.createBetByUserId);
/* router.get("/:pid", placesController.getPlaceById);
router.get("/user/:uid", placesController.getPlacesByUserId);
router.patch("/:pid", placesController.updatePlace);
router.delete("/:pid", placesController.deletePlace);
router.post("/bet/:uid", placesController.createBetByUserId); */
module.exports=router