const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { runDailyLottery } = require("../scheduler");

dotenv.config();

module.exports = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bxc5w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
      );
    }
    
    await runDailyLottery();
    res.status(200).json({ message: "Lottery run completed." });
  } catch (error) {
    console.error("Scheduler error:", error);
    res.status(500).json({ error: "Failed to run lottery." });
  }
};
