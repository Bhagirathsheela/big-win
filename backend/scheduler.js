// scheduler.js
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Bet = require("./models/bet");
const Result = require("./models/result");
const User = require("./models/user");

// DAILY @ 6:00 AM IST 0 6 * * *
cron.schedule(
  "* * * * *",
  async () => {
    console.log(
      `📅 Running daily lottery at ${new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })}`
    );
    await runDailyLottery();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

// Reuse transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Add this line to bypass certificate errors
  },
});
function get6amIST(date = new Date()) {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const istOffset = 5.5 * 60 * 60000;

  const istDate = new Date(utc + istOffset);
  istDate.setHours(6, 0, 0, 0);

  const utcDate = new Date(istDate.getTime() - istOffset);
  return utcDate;
}

async function runDailyLottery() {
  const today6am = get6amIST(); // 6 AM today IST
  const yesterday6am = get6amIST(new Date(Date.now() - 24 * 60 * 60 * 1000)); // 6 AM yesterday IST

  //console.log("Yesterday 6 AM UTC:", yesterday6am);
  //console.log("Today 6 AM UTC:", today6am);

  //  Check if result for today already exists
  const existingResult = await Result.findOne({
    createdAt: { $gte: today6am },
  });
  // un comment to safe guard 1 result daily
  /* if (existingResult) {
    console.log("🛑 Result already exists for today. Skipping...");
    return;
  } */

  //  Fetch only bets from yesterday 6am to today 6am
  /* const allBets = await Bet.find({
    createdAt: { $gte: yesterday6am, $lt: today6am },
  }); */

  // Fetch all bets added after 6 AM today
  const allBets = await Bet.find({
    createdAt: { $gte: today6am },
  });

  const flatBets = allBets.flatMap((bet) =>
    bet.selectedBet.map((entry) => ({
      userId: bet.creator,
      number: entry.selectedNumber,
      amount: entry.amount,
    }))
  );

  const totalPool = flatBets.reduce((acc, entry) => acc + entry.amount, 0);
  const possibleWinners = flatBets.filter(
    (entry) => entry.amount * 9 <= totalPool
  );

  let winnerEntry;

  if (possibleWinners.length > 0) {
    const randomIndex = Math.floor(Math.random() * possibleWinners.length);
    winnerEntry = possibleWinners[randomIndex];
  } else {
    const allNumbers = Array.from({ length: 99 }, (_, i) => i + 1);
    const numbersBet = flatBets.map((b) => b.number);
    const unbetNumbers = allNumbers.filter((n) => !numbersBet.includes(n));
    const randomIndex = Math.floor(Math.random() * unbetNumbers.length);
    const fallbackWinner = unbetNumbers[randomIndex];
    console.log("before result", fallbackWinner);
    await Result.create({
      winnerNumber: fallbackWinner,
      amount: 0,
      winners: [],
    });
    console.log(`🎲 No winner today. Number ${fallbackWinner} was not bet.`);
    return;
  }

  const winningNumber = winnerEntry.number;
  const winners = flatBets.filter((entry) => entry.number === winningNumber);

  const totalPayout = winners.reduce((sum, w) => sum + w.amount * 9, 0);
  //console.log(winningNumber, winners)
  if (totalPayout > totalPool) {
    const allNumbers = Array.from({ length: 99 }, (_, i) => i + 1);
    const numbersBet = flatBets.map((b) => b.number);
    const unbetNumbers = allNumbers.filter((n) => !numbersBet.includes(n));
    const randomIndex = Math.floor(Math.random() * unbetNumbers.length);
    const fallbackWinner = unbetNumbers[randomIndex];
    
    await Result.create({
      winnerNumber: fallbackWinner,
      amount: 0,
      winners: [],
    });
    console.log(
      `🎲 No winner today. Total payout (${totalPayout}) exceeds pool (${totalPool}).`
    );
    return;
  }

  const resultWinners = [];

  for (const winner of winners) {
    const user = await User.findById(winner.userId).select("name email");

    if (!user) {
      console.warn("⚠️ Winner user not found.");
      continue;
    }

    const userWinningAmount = winner.amount * 9;

    resultWinners.push({
      userId: user._id,
      name: user.name,
      email: user.email,
      amount: userWinningAmount,
    });

    console.log(
      `🏆 Winner: ${user.name} (${user.email}) won ₹${userWinningAmount} on number ${winningNumber}`
    );

    // await sendWinnerEmail(user, { number: winningNumber }, userWinningAmount);
    // to send the email manually
    //sendWinnerEmail({ name: "Dummy User ", email: "bhagirathsheela@gmail.com" },{ number: 7 },2500);
  }

  // create single Result document
  await Result.create({
    winnerNumber: winningNumber,
    amount: totalPayout,
    winners: resultWinners,
  });
}

async function sendWinnerEmail(user, winnerEntry, winningAmount) {
  try {
    await transporter.sendMail({
      from: '"Big Win Lottery 🎰" <test@gmail.com>',
      to: user.email,
      subject: `🎉 Jackpot Alert! ${user.name}, You Just Won ₹${winningAmount}! 🤑`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px; border-radius: 10px; color: #333;">
          <h1 style="color: #4CAF50;">🎊 Congratulations, ${user.name}! 🎊</h1>
          <p style="font-size: 18px;">Your lucky number <strong style="color: #007bff;">${winnerEntry.number}</strong> just hit the jackpot!</p>
          <p style="font-size: 20px;"><strong>💰 You’ve won ₹${winningAmount}!</strong></p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 16px;">Thank you for playing <strong>Big Win Lottery</strong>. We love having you in the game!</p>
          <p style="font-size: 16px;">Stay tuned for more chances to win big. 🍀</p>
          <br />
          <a href="https://your-lottery-site.com" style="display: inline-block; padding: 12px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            🔁 Play Again
          </a>
          <br /><br />
          <small style="color: #777;">This is an automated message. Please do not reply.</small>
        </div>
      `,
    });
    console.log("✅ Email sent to:", user.email);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}

module.exports = { runDailyLottery }; // Optional, depending on how you load this


