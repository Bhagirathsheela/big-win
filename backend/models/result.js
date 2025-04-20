const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resultSchema = new Schema({
    date: { type: Date, required: true, default: Date.now },
    winnerNumber: { type: Number, required: true },
    amount: { type: Number, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true,ref:'User' },
  
});

module.exports=mongoose.model('Result',resultSchema)