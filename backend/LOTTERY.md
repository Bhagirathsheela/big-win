# Big Win — Lottery

The lottery has just two moving parts:

1. **Automatic schedule** — driven by `CRON_SCHEDULES` env var (in `nodemon.json`)
2. **Manual trigger** — `POST /api/lottery/run` with a secret header

That's it. No CLI scripts, no separate `.env`, no test runners.

---

## Change the schedule

Edit `backend/nodemon.json`, change the `CRON_SCHEDULES` value, restart the
server. Cron expressions are in **Asia/Kolkata** time.

```jsonc
// Once a day at 6am IST (default)
"CRON_SCHEDULES": "0 6 * * *"

// Every 12 hours (6am and 6pm)
"CRON_SCHEDULES": "0 6,18 * * *"

// Every 8 hours (6am, 2pm, 10pm)
"CRON_SCHEDULES": "0 6,14,22 * * *"

// Every 6 hours (midnight, 6am, noon, 6pm)
"CRON_SCHEDULES": "0 */6 * * *"

// Every 4 hours
"CRON_SCHEDULES": "0 */4 * * *"

// Every 30 minutes (for stress-testing)
"CRON_SCHEDULES": "*/30 * * * *"
```

**Cron expression format** (5 fields, left to right):
```
 minute   hour   day-of-month   month   day-of-week
 0-59     0-23   1-31           1-12    0-6 (Sun=0)
```

For production deploys (where you run `node app.js` directly, not nodemon),
set `CRON_SCHEDULES` in your hosting platform's environment variables panel
(Vercel / Render / Railway / etc.) — same string.

---

## Trigger a round manually

Authenticated with `CRON_SECRET` from `nodemon.json`:

**PowerShell (Windows)**
```powershell
$secret = "supersecret_lottery_trigger"
curl.exe -X POST http://localhost:5000/api/lottery/run -H "Authorization: Bearer $secret"
```

**bash / macOS / Linux**
```bash
curl -X POST http://localhost:5000/api/lottery/run \
  -H "Authorization: Bearer supersecret_lottery_trigger"
```

**For your live server**, swap `http://localhost:5000` for the deployed
backend URL.

Optional query params (test rounds without persisting):
- `?dryRun=true` — compute everything but don't save or send emails
- `?noEmail=true` — save to DB but skip emails
- `?windowHours=12` — only consider bets from the last 12 hours

```bash
curl -X POST "http://localhost:5000/api/lottery/run?dryRun=true" \
  -H "Authorization: Bearer supersecret_lottery_trigger"
```

The endpoint returns the full result JSON:
```json
{
  "message": "✅ Lottery run completed.",
  "result": {
    "windowStart": "...", "windowEnd": "...",
    "totalPool": 846, "totalPayout": 0, "houseMargin": 846,
    "winningNumber": 28, "winnerCount": 0, "betCount": 19,
    "winners": []
  }
}
```

---

## All lottery env vars (in `nodemon.json`)

| Key | Default | Effect |
|---|---|---|
| `CRON_SCHEDULES` | `"0 6 * * *"` | Comma-separated cron strings (Asia/Kolkata). |
| `CRON_SECRET` | (none) | Required to call `POST /api/lottery/run`. |
| `HOUSE_MARGIN` | `"0.2"` | House always keeps ≥ this fraction of the pool. |
| `PAYOUT_MULTIPLIER` | `"9"` | Winner gets `stake × this`. |
| `MAX_WINDOW_HOURS` | `48` | If no recent result, only consider bets from last N hours. |
| `LOTTERY_TZ` | `"Asia/Kolkata"` | Timezone for cron parsing. |
| `ADMIN_EMAIL` | (none) | If set, gets a round-summary email after each draw. |
| `NOTIFY_LOSERS` | `false` | If `"true"`, emails non-winners too. |

---

## How a round picks a winner

For every number 0–99, the engine computes the **liability** = sum of
`stake × PAYOUT_MULTIPLIER` for every bet on that number. Numbers whose
liability would exceed `pool × (1 - HOUSE_MARGIN)` are ineligible. The
winning number is picked **uniformly at random** from the remaining
eligible numbers (numbers nobody bet on are always eligible since their
liability is zero). This guarantees the house always profits.
