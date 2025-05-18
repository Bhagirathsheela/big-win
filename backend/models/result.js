const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resultSchema = new Schema(
  {
    winnerNumber: { type: Number, required: true },
    amount: { type: Number, required: true }, // total payout
    winners: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        amount: { type: Number, required: true }, // this user's payout
      },
    ]
  },
  { timestamps: true }
);

module.exports=mongoose.model('Result',resultSchema)