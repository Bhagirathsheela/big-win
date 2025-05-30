import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../common/context/auth-context";
import { useHttpClient } from "../common/hooks/http-hook";

export default function BettingPage() {
  const [bets, setBets] = useState([]);
  const [error, setError] = useState(null); // For showing error messages
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // Used to get the current path for redirect after login
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const stored = localStorage.getItem("selectedNumbers");
    const selected = stored ? JSON.parse(stored) : [];
    setBets(selected.map((num) => ({ selectedNumber: num, amount: 50 })));
  }, []);

  const handleAmountChange = (index, newAmount) => {
    const updated = [...bets];
    updated[index].amount = Math.max(0, parseInt(newAmount) || 0);
    setBets(updated);
  };

  const handleIncrease = (index) => {
    const updated = [...bets];
    updated[index].amount += 50;
    setBets(updated);
  };

  const handleDecrease = (index) => {
    const updated = [...bets];
    updated[index].amount = Math.max(0, updated[index].amount - 50);
    setBets(updated);
  };

  const handleRemove = (numberToRemove) => {
    const updated = bets.filter((bet) => bet.selectedNumber !== numberToRemove);
    setBets(updated);
    localStorage.setItem(
      "selectedNumbers",
      JSON.stringify(updated.map((bet) => bet.selectedNumber))
    );

    //  Redirect to home if all bets removed
    if (updated.length === 0) {
      navigate("/");
    }
  };

  const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

  const handleFinalProceed = async () => {
    console.log(bets);

    //  Empty array validation
    if (bets.length === 0) {
      setError("No bets selected. Please choose at least one number.");
      return;
    }

    // Check if user is logged in
    if (!auth.token) {
      navigate("/signin", { state: { from: location }, replace: true });
      return;
    }

    // Check if all bet amounts are more than 0
    const hasZeroOrNegative = bets.some((bet) => bet.amount <= 0);
    if (hasZeroOrNegative) {
      setError("Amount should be more than 0 ₹ for all bets.");
      return;
    }

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/bets`,
        "POST",
        JSON.stringify({
          selectedBet: bets,
          creator: auth.userInfo.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      if (responseData) {
        navigate("/summary", {
          state: { bets, totalAmount, paymentId: "74ASDF-BHGAI-234W" },
        });
        localStorage.removeItem("selectedNumbers");
      }
    } catch (err) {
      setError("Something went wrong while placing your bet.");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-indigo-800">
        Place Your Bets
      </h1>

      {error && (
        <div className="mb-4 text-red-600 font-medium bg-red-100 p-2 px-4 rounded">
          {error}
        </div>
      )}

      <div className="w-full max-w-xl space-y-4">
        {bets.map((bet, index) => (
          <div
            key={bet.selectedNumber}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
          >
            <div className="font-medium text-lg text-indigo-700">
              #{bet.selectedNumber}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDecrease(index)}
                className="w-8 h-8 text-lg bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <input
                type="number"
                className="w-20 px-2 py-1 border rounded text-center"
                value={bet.amount}
                onChange={(e) => handleAmountChange(index, e.target.value)}
              />
              <button
                onClick={() => handleIncrease(index)}
                className="w-8 h-8 text-lg bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleRemove(bet.selectedNumber)}
              className="ml-4 text-red-500 hover:text-red-700 font-bold text-lg"
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 text-xl font-semibold text-indigo-800">
        Total Bet Amount: ₹{totalAmount}
      </div>

      <button
        onClick={handleFinalProceed}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition duration-200"
      >
        Final Proceed
      </button>

      {/*  Back to home button */}
      <button
        onClick={() => navigate("/")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Back to Home
      </button>
    </div>
  );
}
