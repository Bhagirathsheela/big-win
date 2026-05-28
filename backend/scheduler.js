// scheduler.js
// Flexible Big Win lottery engine:
//   - Schedules driven by CRON_SCHEDULES env (comma-separated cron strings, in Asia/Kolkata).
//     Example: CRON_SCHEDULES="0 6 * * *,0 12 * * *,0 18 * * *"  // 3 draws/day
//     Default: "0 6 * * *"                                       // 6 AM IST daily
//   - Window for each draw = "since last Result.createdAt"
//     (capped to MAX_WINDOW_HOURS so an idle backlog can't grow unbounded).
//   - House margin: total payout is guaranteed strictly less than total pool.
//     HOUSE_MARGIN env (0..1, default 0.2). Numbers whose payout would exceed
//     pool * (1 - HOUSE_MARGIN) are not eligible.
//   - Numbers range: 0..99 (matches the frontend tile grid).

const cron = require("node-cron");
const Bet = require("./models/bet");
const Result = require("./models/result");
const User = require("./models/user");
const { sendEmail } = require("./utils/email");
const tpl = require("./utils/emailTemplates");

const NUMBERS_MIN = 0;
const NUMBERS_MAX = 99;
const PAYOUT_MULTIPLIER = Number(process.env.PAYOUT_MULTIPLIER) || 9;
const HOUSE_MARGIN = Math.min(0.95, Math.max(0, Number(process.env.HOUSE_MARGIN) || 0.2));
const MAX_WINDOW_HOURS = Number(process.env.MAX_WINDOW_HOURS) || 48;
const TIMEZONE = process.env.LOTTERY_TZ || "Asia/Kolkata";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || null;
const NOTIFY_LOSERS = String(process.env.NOTIFY_LOSERS || "false").toLowerCase() === "true";

const allNumbers = () => {
  const arr = [];
  for (let i = NUMBERS_MIN; i <= NUMBERS_MAX; i++) arr.push(i);
  return arr;
};

const pad = (n) => String(n).padStart(2, "0");

// Pick the start of the window: latest Result.createdAt, or fall back to now - MAX_WINDOW_HOURS.
async function computeWindowStart() {
  const last = await Result.findOne({}).sort({ createdAt: -1 }).select("createdAt");
  const cap = new Date(Date.now() - MAX_WINDOW_HOURS * 60 * 60 * 1000);
  if (!last) return cap;
  return last.createdAt > cap ? last.createdAt : cap;
}

// Flatten bets into [{ userId, name?, email?, number, amount }] and group by number.
function buildLiability(allBets) {
  const flat = [];
  const liability = new Map(); // number -> { total, bets: [] }

  for (const bet of allBets) {
    for (const entry of bet.selectedBet || []) {
      const n = Number(entry.selectedNumber);
      const amt = Number(entry.amount) || 0;
      if (Number.isNaN(n) || amt <= 0) continue;
      const item = { userId: bet.creator, number: n, amount: amt };
      flat.push(item);
      if (!liability.has(n)) liability.set(n, { total: 0, bets: [] });
      const slot = liability.get(n);
      slot.bets.push(item);
      slot.total += amt * PAYOUT_MULTIPLIER;
    }
  }
  return { flat, liability };
}

function pickWinningNumber(liability, totalPool) {
  // Numbers eligible if total payout <= pool * (1 - HOUSE_MARGIN).
  // Always-eligible: numbers nobody bet on (payout = 0).
  const maxAllowedPayout = totalPool * (1 - HOUSE_MARGIN);
  const eligible = [];
  for (let n = NUMBERS_MIN; n <= NUMBERS_MAX; n++) {
    const slot = liability.get(n);
    const payout = slot ? slot.total : 0;
    if (payout <= maxAllowedPayout) eligible.push(n);
  }
  // Defensive: if margin too tight (e.g., pool=0 and bets exist), pick lowest-liability number.
  if (eligible.length === 0) {
    let best = NUMBERS_MIN;
    let bestPayout = Infinity;
    for (let n = NUMBERS_MIN; n <= NUMBERS_MAX; n++) {
      const payout = (liability.get(n) || { total: 0 }).total;
      if (payout < bestPayout) { bestPayout = payout; best = n; }
    }
    return best;
  }
  return eligible[Math.floor(Math.random() * eligible.length)];
}

/**
 * Run one lottery round.
 * @param {Object} opts
 * @param {Date|null} opts.windowStart   start of bet window (defaults: since last Result)
 * @param {Date|null} opts.windowEnd     end of bet window (defaults: now)
 * @param {boolean}   opts.dryRun        true = compute everything but don't persist or email
 * @param {boolean}   opts.sendEmails    true = email winners (and losers if NOTIFY_LOSERS)
 * @returns {Promise<Object>}            structured result for logging/tests
 */
async function runLotteryRound(opts = {}) {
  const {
    windowStart: providedStart = null,
    windowEnd = new Date(),
    dryRun = false,
    sendEmails = true,
  } = opts;

  const windowStart = providedStart || (await computeWindowStart());

  const allBets = await Bet.find({
    createdAt: { $gte: windowStart, $lt: windowEnd },
  });

  const { flat, liability } = buildLiability(allBets);
  const totalPool = flat.reduce((s, e) => s + e.amount, 0);
  const winningNumber = pickWinningNumber(liability, totalPool);

  const winSlot = liability.get(winningNumber) || { total: 0, bets: [] };
  const totalPayout = winSlot.total;

  // Hydrate winners with user info
  const resultWinners = [];
  for (const w of winSlot.bets) {
    const user = await User.findById(w.userId).select("name email");
    if (!user) continue;
    resultWinners.push({
      userId: user._id,
      name: user.name,
      email: user.email,
      amount: w.amount * PAYOUT_MULTIPLIER,
      stake: w.amount,
    });
  }

  // Hydrate losers (only used if NOTIFY_LOSERS)
  const loserStakeByUser = new Map(); // userId -> totalStake
  if (sendEmails && NOTIFY_LOSERS) {
    for (const f of flat) {
      if (f.number === winningNumber) continue;
      const key = String(f.userId);
      loserStakeByUser.set(key, (loserStakeByUser.get(key) || 0) + f.amount);
    }
  }

  const summary = {
    windowStart,
    windowEnd,
    totalPool,
    totalPayout,
    houseMargin: totalPool - totalPayout,
    winningNumber,
    winnerCount: resultWinners.length,
    betCount: flat.length,
    dryRun,
  };

  console.log(
    `🎰 Round ${dryRun ? "[DRY] " : ""}${windowStart.toISOString()} → ${windowEnd.toISOString()}\n` +
    `   pool=${totalPool}  payout=${totalPayout}  house=${totalPool - totalPayout}\n` +
    `   winning #${pad(winningNumber)}  winners=${resultWinners.length}/${flat.length} bets`
  );

  if (dryRun) {
    return { ...summary, winners: resultWinners };
  }

  // Persist
  await Result.create({
    winnerNumber: winningNumber,
    amount: totalPayout,
    winners: resultWinners,
  });

  // Email winners
  if (sendEmails) {
    for (const w of resultWinners) {
      try {
        const { subject, html } = tpl.winnerEmail({
          name: w.name, number: winningNumber, amount: w.amount,
        });
        await sendEmail({ to: w.email, subject, html });
      } catch (e) {
        console.error("email winner failed:", w.email, e.message);
      }
    }

    if (NOTIFY_LOSERS && loserStakeByUser.size) {
      const userIds = [...loserStakeByUser.keys()];
      const users = await User.find({ _id: { $in: userIds } }).select("name email");
      for (const u of users) {
        try {
          const stake = loserStakeByUser.get(String(u._id)) || 0;
          const { subject, html } = tpl.noWinEmail({
            name: u.name, number: winningNumber, totalSpent: stake,
          });
          await sendEmail({ to: u.email, subject, html });
        } catch (e) {
          console.error("email loser failed:", u.email, e.message);
        }
      }
    }

    if (ADMIN_EMAIL) {
      try {
        const { subject, html } = tpl.roundSummaryEmail({
          winnerNumber: winningNumber,
          totalPool,
          totalPayout,
          winnerCount: resultWinners.length,
          roundAt: windowEnd.toLocaleString("en-IN", { timeZone: TIMEZONE }),
        });
        await sendEmail({ to: ADMIN_EMAIL, subject, html });
      } catch (e) {
        console.error("admin summary email failed:", e.message);
      }
    }
  }

  return { ...summary, winners: resultWinners };
}

// Backwards-compatible alias for routes/test-runner that already imports this.
const runDailyLottery = (opts) => runLotteryRound(opts);

// Wire up cron from CRON_SCHEDULES env
function startSchedules() {
  const raw = process.env.CRON_SCHEDULES || "0 6 * * *";
  const schedules = raw.split(",").map((s) => s.trim()).filter(Boolean);
  for (const expr of schedules) {
    if (!cron.validate(expr)) {
      console.warn(`⚠️  Invalid cron expression: "${expr}" — skipped`);
      continue;
    }
    cron.schedule(expr, async () => {
      console.log(`📅 Cron "${expr}" firing at ${new Date().toLocaleString("en-IN", { timeZone: TIMEZONE })}`);
      try { await runLotteryRound(); }
      catch (e) { console.error("Lottery error:", e); }
    }, { scheduled: true, timezone: TIMEZONE });
    console.log(`⏰ Scheduled lottery: "${expr}" (${TIMEZONE})`);
  }
}

// Only start cron when imported by the live server (not by scripts/tests).
if (process.env.LOTTERY_AUTOSTART !== "false") {
  startSchedules();
}

module.exports = {
  runLotteryRound,
  runDailyLottery,
  startSchedules,
  // exported for tests
  buildLiability,
  pickWinningNumber,
  computeWindowStart,
  PAYOUT_MULTIPLIER,
  HOUSE_MARGIN,
};
