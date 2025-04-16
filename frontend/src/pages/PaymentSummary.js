// PaymentSummary.js
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bets, totalAmount, paymentId } = location.state || {};

  if (!bets || !paymentId) return <div className="p-6 text-red-600">No transaction found.</div>;

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Payment Successful 🎉</h2>
      <div className="bg-gray-100 p-4 rounded shadow w-full max-w-lg">
        <div className="text-gray-700 mb-2">
          <strong>Payment ID:</strong> {paymentId}
        </div>
        <div className="text-gray-700 mb-4">
          <strong>Total Amount:</strong> ₹{totalAmount}
        </div>
        <h3 className="text-lg font-semibold text-indigo-700 mb-2">Your Bets:</h3>
        <ul className="space-y-1 text-gray-800">
          {bets.map((bet) => (
            <li key={bet.number} className="flex justify-between">
              <span>Number {bet.number}</span>
              <span>₹{bet.amount}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
}
