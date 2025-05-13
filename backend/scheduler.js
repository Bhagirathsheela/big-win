// scheduler.js
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Bet = require('./models/bet');
const Result = require("./models/result");
const User = require("./models/user");

// DAILY @ 4:49 PM IST
cron.schedule("* * * * *", async () => {
  //console.log(`📅 Running daily lottery at ${new Date().toLocaleString("en-IN",{timeZone: "Asia/Kolkata" })}`);
  await runDailyLottery();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

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

async function runDailyLottery() {
  const allBets = await Bet.find();
  const flatBets = allBets.flatMap(bet =>
    bet.selectedBet.map(entry => ({
      userId: bet.creator,
      number: entry.selectedNumber,
      amount: entry.amount
    }))
  );

  const totalPool = flatBets.reduce((acc, entry) => acc + entry.amount, 0);
  const possibleWinners = flatBets.filter(entry => entry.amount * 9 <= totalPool);

  let winnerEntry;

  if (possibleWinners.length > 0) {
    const randomIndex = Math.floor(Math.random() * possibleWinners.length);
    winnerEntry = possibleWinners[randomIndex];
  } else {
    const allNumbers = Array.from({ length: 99 }, (_, i) => i + 1);
    const numbersBet = flatBets.map(b => b.number);
    const unbetNumbers = allNumbers.filter(n => !numbersBet.includes(n));
    const randomIndex = Math.floor(Math.random() * unbetNumbers.length);
    const fallbackWinner = unbetNumbers[randomIndex];

    await Result.create({
      date:new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      winnerNumber: fallbackWinner,
      amount: 0,
      creator: null
    });

    //console.log(`🎲 No winner today. Number ${fallbackWinner} was not bet.`);
    return;
  }

  const winningAmount = winnerEntry.amount * 9;
  const user = await User.findById(winnerEntry.userId).select("name email");

  if (!user) {
    console.warn("⚠️ Winner user not found.");
    return;
  }

  await Result.create({
    /* date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }), */
    date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    winnerNumber: winnerEntry.number,
    amount: winningAmount,
    creator: winnerEntry.userId
  });

  //console.log(`🏆 Winner: ${user.name} (${user.email}) won ₹${winningAmount} on number ${winnerEntry.number}`);

  //await sendWinnerEmail(user, winnerEntry, winningAmount);
  //sendWinnerEmail({ name: "Dummy User ", email: "bhagirathsheela@gmail.com" },{ number: 7 },2500);
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
  
/* async function sendWinnerEmail(user, winnerEntry, winningAmount) {
  try {
    await transporter.sendMail({
      from: '"Big Win Lottery" <test@gmail.com>',
      to: user.email,
      subject: "🎉 You Won the Lottery!",
      html: `
        <h2>Hey ${user.name},</h2>
        <p>Congratulations! 🎊</p>
        <p>Your number <strong>${winnerEntry.number}</strong> has won <strong>₹${winningAmount}</strong>.</p>
        <p>Thank you for playing Big Win!</p>
        <br />
        <small>This is an automated message. Please do not reply.</small>
      `,
    });
    console.log("✅ Email sent to:", user.email);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
} */



module.exports = {}; // Optional, depending on how you load this
