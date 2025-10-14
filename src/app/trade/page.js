"use client";
import { useState } from "react";

export default function TradePage() {
  const [stock, setStock] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [message, setMessage] = useState("");

  const handleBuy = async () => {
    const res = await fetch("/api/trades/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock, quantity }),
    });
    const data = await res.json();
    setMessage(data.error || "Trade executed successfully!");
  };

  return (
    <div className="max-w-md mx-auto bg-[#1e1e2f] p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-white">Buy / Sell Stocks</h2>
      <input
        type="text"
        placeholder="Stock Symbol"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="text-white w-full p-2 mb-4 rounded bg-[#2d2d3f]"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="text-white w-full p-2 mb-4 rounded bg-[#2d2d3f]"
      />
      <button
        onClick={handleBuy}
        className="w-full bg-[#00b894] p-2 rounded hover:bg-green-500"
      >
        Execute Trade
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
