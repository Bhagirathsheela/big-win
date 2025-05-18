// BettingPage.js
import { useState, useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../common/context/auth-context";
import { useHttpClient } from "../common/hooks/http-hook";

export default function BettingPage() {
  const [bets, setBets] = useState([]);
   const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const {sendRequest } = useHttpClient();

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
  };

  const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

   const handleFinalProceed = async () => {
    console.log(bets)
   // const totalAmount=bets.map((val)=>{ return val.amount}).reduce((acc, current) => acc + current, 0);
   // console.log("Total amount",totalAmount)
    //alert("Bet placed! If your number wins, you get 9x the amount.");
    //pay?pa={UPI_ID}&pn={Name}&mc=&tid={TxnID}&tr={TxnRef}&tn={Note}&am={Amount}&cu=INR
   // const upiUrl = `upi://pay?pa=receiver@upi&pn=ReceiverName&am=100&tn=Thanks+for+your+purchase&cu=INR`;
     // window.location.href = upiUrl;
     try {
     const responseData= await sendRequest("http://localhost:5000/api/bets","POST",
        JSON.stringify({
          selectedBet: bets,
          creator: auth.userInfo.userId
          }),
        {
            "Content-Type": "application/json",
            Authorization:'Bearer '+ auth.token
            
        }
      );
      if(responseData){
        navigate("/summary", { state: { bets, totalAmount, paymentId: "74ASDF-BHGAI-234W"} });
        localStorage.removeItem("selectedNumbers");
      }
    } catch (err) {} 
  
  };
 /*  const handleFinalProceed = () => {
    console.log("razor pay",window.Razorpay)
    const options = {
      key: "rzp_test_YourTestKeyHere", // Replace with your test key from Razorpay dashboard
      amount: totalAmount * 100, // Razorpay expects amount in paise
      currency: "INR",
      name: "Lucky Numbers Lottery",
      description: "Lottery Ticket Payment",
      image: "https://yourlogo.com/logo.png", // Optional
      handler: function (response) {
        console.log("Payment success", response);
        // Show confirmation UI
        navigate("/summary", { state: { bets, totalAmount, paymentId: response.razorpay_payment_id } });
  
        // Clear stored selection
        localStorage.removeItem("selectedNumbers");
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#4f46e5",
      },
    };
    if (typeof window.Razorpay === "undefined") {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }
      
    const rzp = new window.Razorpay(options);
    rzp.open();
  }; */
  

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-indigo-800">Place Your Bets</h1>

      <div className="w-full max-w-xl space-y-4">
        {bets.map((bet, index) => (
          <div
            key={bet.selectedNumber}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
          >
            <div className="font-medium text-lg text-indigo-700">#{bet.selectedNumber}</div>

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
    </div>
  );
}
