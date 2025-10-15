"use client";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("Deposit"); // Deposit or Withdraw
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    async function fetchData() {
      try {
        const [walletRes, txRes] = await Promise.all([
          fetch("/api/wallet", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/transactions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const walletData = await walletRes.json();
        const txData = await txRes.json();

        setBalance(walletData.balance || 0);
        setTransactions(Array.isArray(txData) ? txData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !amount || Number(amount) <= 0) return;

    if (action === "Withdraw" && Number(amount) > balance) {
      setMessage("❌ Insufficient balance");
      return;
    }

    const endpoint =
      action === "Deposit" ? "/api/wallet/deposit" : "/api/wallet/withdraw";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const data = await res.json();
      if (data.error) {
        setMessage(`❌ ${data.error}`);
      } else {
        setMessage(`✅ ${action} successful!`);
        setBalance(data.newBalance);
        setTransactions((prev) => [
          {
            id: Date.now(),
            type: action,
            amount: Number(amount),
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setAmount("");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-300 animate-pulse">
        Loading...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 sm:p-6 md:p-10">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-white">
        💰 Wallet & Transactions
      </h2>

      {/* Balance Card */}
      <div className="w-full max-w-md mb-6 p-6 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 rounded-3xl shadow-xl text-center text-white transform transition-transform hover:scale-105">
        <p className="text-lg sm:text-xl font-medium opacity-90">Current Balance</p>
        <p className="text-3xl sm:text-4xl font-bold mt-2">${balance.toFixed(2)}</p>
      </div>

      {/* Deposit / Withdraw Form */}
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-3xl shadow-lg space-y-4">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setAction("Deposit")}
            className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${
              action === "Deposit" ? "bg-green-500 shadow-lg" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setAction("Withdraw")}
            className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${
              action === "Withdraw" ? "bg-red-500 shadow-lg" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Withdraw
          </button>
        </div>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-700 text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <button
          onClick={handleSubmit}
          className={`w-full py-3 rounded-xl font-bold text-lg transition-transform ${
            action === "Deposit"
              ? "bg-green-500 hover:bg-green-600 hover:scale-105"
              : "bg-red-500 hover:bg-red-600 hover:scale-105"
          }`}
        >
          {action}
        </button>

        {message && (
          <p className="text-center mt-2 text-yellow-400 font-medium animate-pulse">
            {message}
          </p>
        )}
      </div>

      {/* Transactions Table */}
      <div className="w-full max-w-2xl mt-10 overflow-x-auto">
        <h3 className="text-2xl font-semibold mb-4 text-white text-center">Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-400">No transactions yet.</p>
        ) : (
          <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-white">Type</th>
                <th className="p-3 text-white">Amount</th>
                <th className="p-3 text-white">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="odd:bg-gray-700 even:bg-gray-800 hover:bg-indigo-900 transition-colors"
                >
                  <td
                    className={`p-3 font-semibold ${
                      tx.type === "Deposit" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {tx.type}
                  </td>
                  <td className="p-3 text-white">${tx.amount.toFixed(2)}</td>
                  <td className="p-3 text-gray-300">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
