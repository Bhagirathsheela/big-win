const express = require("express");
const { runDailyLottery } = require("../scheduler");

const router = express.Router();

// Secure this with a token if needed (explained later)
router.get("/run", async (req, res) => {
    const token = req.headers.authorization;
    if (token !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(403).json({ message: "Forbidden" });
    }
  try {
    await runDailyLottery();
    res.json({ message: "✅ Lottery run completed." });
  } catch (err) {
    console.error("❌ Lottery run error:", err);
    res.status(500).json({ message: "❌ Lottery run failed." });
  }
});

module.exports = router;
