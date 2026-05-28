const express = require("express");
const { runLotteryRound } = require("../scheduler");

const router = express.Router();

// POST /api/lottery/run         (preferred)
// GET  /api/lottery/run         (kept for backwards compat)
// Query params (also accepted as JSON body on POST):
//   dryRun=true        — don't persist or send emails
//   noEmail=true       — persist but skip emails
//   windowHours=N      — use last N hours as the bet window
//
// Auth: header Authorization: Bearer <CRON_SECRET>
async function handle(req, res) {
  const token = req.headers.authorization;
  if (!process.env.CRON_SECRET || token !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const src = { ...req.query, ...(req.body || {}) };
  const opts = {
    dryRun: String(src.dryRun || "").toLowerCase() === "true",
    sendEmails: !(String(src.noEmail || "").toLowerCase() === "true"),
  };
  if (src.windowHours) {
    const hrs = Number(src.windowHours);
    if (hrs > 0) {
      opts.windowStart = new Date(Date.now() - hrs * 60 * 60 * 1000);
      opts.windowEnd = new Date();
    }
  }
  try {
    const result = await runLotteryRound(opts);
    res.json({ message: "✅ Lottery run completed.", result });
  } catch (err) {
    console.error("❌ Lottery run error:", err);
    res.status(500).json({ message: "❌ Lottery run failed.", error: err.message });
  }
}

router.get("/run", handle);
router.post("/run", handle);

module.exports = router;
