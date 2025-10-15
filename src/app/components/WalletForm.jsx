"use client";
import { useState } from "react";

export default function WalletForm({ type }) {
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const endpoint = type === "deposit" ? "/api/wallet/deposit" : "/api/wallet/withdraw";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    setMessage(data.error || `${type} successful!`);
  };

  return (
    <div className="bg-[#1e1e2f] p-4 rounded shadow max-w-sm mx-auto">
      <h3 className="text-xl font-bold mb-4">{type === "deposit" ? "Deposit Cash" : "Withdraw Cash"}</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full p-2 mb-4 rounded bg-[#2d2d3f]"
        placeholder="Enter amount"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-[#00b894] p-2 rounded hover:bg-green-500"
      >
        {type === "deposit" ? "Deposit" : "Withdraw"}
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
