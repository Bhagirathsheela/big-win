const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
    bets: [{ type: mongoose.Types.ObjectId, required: true, ref: "Bet" }],
  },
  { timestamps: true }
);

//await userSchema.init();

module.exports=mongoose.model("User",userSchema);