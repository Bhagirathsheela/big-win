const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const betSchema = new Schema(
  {
    selectedBet: [
      {
        amount: { type: Number, required: true },
        selectedNumber: { type: Number, required: true },
      },
    ],
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    /*  date: { type: String, required: true } */
  },
  { timestamps: true }
);

module.exports=mongoose.model('Bet',betSchema)