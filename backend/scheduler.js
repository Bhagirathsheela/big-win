// scheduler.js
const cron = require("node-cron");
const mongoose = require("mongoose");
const Bet=require('./models/bets') // Replace with your actual model path
const Result = require("./models/result"); // Model to store daily winner

// Connect to MongoDB if not already connected
/* mongoose.connect("mongodb://localhost:27017/your-db-name", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); */

// Function to run daily at 49 15 * * * PM IST
cron.schedule("* * * * *", async () => {
  console.log(`Running daily lottery at gievn ${Date.now()} IST Time`);
  await runDailyLottery();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});



async function runDailyLottery() {
  
  const allBets = await Bet.find();

  // Flatten all bets into a single array of { number, amount }
  const flatBets = allBets.flatMap(bet =>
    bet.selectedBet.map(entry => ({
      userId: bet.creator,
      number: entry.selectedNumber,
      amount: entry.amount
    }))
  );

  // Calculate total pool amount
  const totalPool = flatBets.reduce((acc, entry) => acc + entry.amount, 0);

  // Try to find a winner number such that (amount * 9 <= totalPool)
  const possibleWinners = flatBets.filter(entry => entry.amount * 9 <= totalPool);

  let winnerEntry;
  if (possibleWinners.length > 0) {
    // Pick a random valid winner
    const randomIndex = Math.floor(Math.random() * possibleWinners.length);
    winnerEntry = possibleWinners[randomIndex];
  } else {
    // No valid winner found, pick a number not bet by any user
    const allNumbers = Array.from({ length: 99 }, (_, i) => i + 1);
    const numbersBet = flatBets.map(b => b.number);
    const unbetNumbers = allNumbers.filter(n => !numbersBet.includes(n));

    const randomIndex = Math.floor(Math.random() * unbetNumbers.length);
    const fallbackWinner = unbetNumbers[randomIndex];

    // Save result with no winner
    await Result.create({
      date: Date.now(),
      winnerNumber: fallbackWinner,
      amount: 0,
      creator: null
    });

    console.log(`🎲 No winner today. Number ${fallbackWinner} was not bet.`);
    return;
  }

  // Save the result for the winning user
  const winningAmount = winnerEntry.amount * 9;

  await Result.create({
    date: Date.now(),
    winnerNumber: winnerEntry.number,
    amount: winningAmount,
    creator: winnerEntry.userId
  });

  console.log(`🏆 Winner: User ${winnerEntry.userId} won ₹${winningAmount} on number ${winnerEntry.number}`);
}


/* async function runDailyLottery() {
  try {
    const allBets = await Bet.find(); // get all user bets
    let winnerUserId = null;

    const betMap = new Map();
    let totalAmount = 0;

    allBets.forEach((bet) => {
      bet.selectedBet.forEach(({ selectedNumber, amount }) => {
        totalAmount += amount;
        if (betMap.has(selectedNumber)) {
          betMap.set(selectedNumber, betMap.get(selectedNumber) + amount);
        } else {
          betMap.set(selectedNumber, amount);
        }
      });
    });

    let winner = null;
 
    for (let i = 1; i <= 99; i++) {
      const betAmount = betMap.get(i) || 0;
      if (betAmount * 9 <= totalAmount && betAmount > 0) {
        winner = i;
        break;
      }
    }

    if (!winner) {
      const numbersWithNoBets = [];
      for (let i = 1; i <= 99; i++) {
        if (!betMap.has(i)) numbersWithNoBets.push(i);
      }
      if (numbersWithNoBets.length > 0) {
        const randomIndex = Math.floor(Math.random() * numbersWithNoBets.length);
        winner = numbersWithNoBets[randomIndex];
      } else {
        console.warn("All numbers have bets. Cannot pick safe random number.");
        winner = Math.floor(Math.random() * 99) + 1;
      }
    }
   
    for (const bet of allBets) {
        const match = bet.selectedBet.find(b => b.selectedNumber === winner);
        if (match) {
          winnerUserId = bet.creator; // found the user who placed a winning bet
          break;
        }
      } 
     await Result.create({
      date: new Date(),
      winnerNumber: winner,
      totalAmount,
      creator:winnerUserId || undefined
    }); 

    console.log("Winner decided:", "Number:",winner,"Amount:",totalAmount,"UserId",winnerUserId);
  } catch (err) {
    console.error("Error running daily lottery:", err);
  }
} */

module.exports = {}; // Optional, depending on how you load this
