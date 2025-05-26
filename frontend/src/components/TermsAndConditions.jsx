import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg mt-10 mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        Terms and Conditions
      </h1>

      <p className="mb-4 text-sm sm:text-base">
        Welcome to our betting platform. By participating in our daily
        number-based game, you agree to the following terms and conditions:
      </p>

      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-2">
        1. Game Rules
      </h2>
      <ul className="list-disc list-inside mb-4 text-sm sm:text-base">
        <li>
          You can place a bet on any number available on the platform each day.
        </li>
        <li>
          Each day, one number will be randomly selected as the lucky number.
        </li>
        <li>The winner is the user who bet on the selected lucky number.</li>
      </ul>

      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-2">
        2. Winning and Payout
      </h2>
      <ul className="list-disc list-inside mb-4 text-sm sm:text-base">
        <li>
          Winners receive a payout of <strong>9 times</strong> their bet amount.
        </li>
        <li>
          For example, if you place a bet of ₹200 and win, your payout will be
          ₹1800.
        </li>
        <li>
          Payouts will be credited to your account as per our withdrawal
          process.
        </li>
      </ul>

      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-2">
        3. Bet Timing
      </h2>
      <ul className="list-disc list-inside mb-4 text-sm sm:text-base">
        <li>
          Bets must be placed before the daily cut-off time (announced on the
          platform).
        </li>
        <li>Once placed, bets cannot be cancelled or modified.</li>
      </ul>

      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-2">
        4. Result Declaration
      </h2>
      <ul className="list-disc list-inside mb-4 text-sm sm:text-base">
        <li>
          The lucky number is declared daily at <strong>6:00 AM</strong> server
          time.
        </li>
        <li>Winners can view results on the platform after the declaration.</li>
      </ul>

      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-2">
        5. Fairness and Randomness
      </h2>
      <ul className="list-disc list-inside mb-4 text-sm sm:text-base">
        <li>
          The winning number is selected randomly using a secure algorithm.
        </li>
        <li>We ensure fair play and transparency in every draw.</li>
      </ul>

      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-2">
        6. Eligibility
      </h2>
      <ul className="list-disc list-inside mb-4 text-sm sm:text-base">
        <li>Participants must be 18 years or older.</li>
        <li>
          By using this platform, you confirm that betting is legal in your
          jurisdiction.
        </li>
      </ul>

      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-2">
        7. Disclaimer
      </h2>
      <ul className="list-disc list-inside mb-4 text-sm sm:text-base">
        <li>
          We are not responsible for any loss of funds due to user error or
          system failures beyond our control.
        </li>
        <li>
          We reserve the right to modify game rules and payout structures at any
          time with prior notice.
        </li>
      </ul>

      <p className="mt-6 text-xs sm:text-sm text-gray-600">
        By continuing to use our platform, you accept these terms. Please gamble
        responsibly.
      </p>
    </div>
  );
};

export default TermsAndConditions;
