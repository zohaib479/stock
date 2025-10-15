"use client";
import { useState, useEffect } from "react";

export default function TradePage() {
  const [tab, setTab] = useState("buy"); // buy or sell
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [message, setMessage] = useState("");

  // Fetch available stocks & user portfolio
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    async function fetchData() {
      try {
        const [stocksRes, portfolioRes] = await Promise.all([
          fetch("/api/stocks"),
          fetch("/api/portfolio", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const stocksData = await stocksRes.json();
        const portfolioData = await portfolioRes.json();

        setStocks(stocksData);
        setPortfolio(portfolioData.portfolio || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  const handleTrade = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setMessage("You must be logged in.");

    const endpoint = tab === "buy" ? "/api/trades/buy" : "/api/trades/sell";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ stock: selectedStock, quantity: Number(quantity) }),
    });

    const data = await res.json();
    setMessage(data.error || "Trade executed successfully!");

    // Reset quantity
    setQuantity(0);
  };

  // Options for sell: only stocks user owns
  const sellOptions = portfolio.filter((p) => p.quantity > 0);

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-[#1e1e2f] rounded shadow text-white">
      <h1 className="text-2xl font-bold mb-4">Trade Stocks</h1>

      {/* Tabs */}
      <div className="flex mb-4">
        <button
          onClick={() => setTab("buy")}
          className={`flex-1 py-2 ${tab === "buy" ? "bg-[#00b894]" : "bg-[#2d2d3f]"}`}
        >
          Buy
        </button>
        <button
          onClick={() => setTab("sell")}
          className={`flex-1 py-2 ${tab === "sell" ? "bg-[#d63031]" : "bg-[#2d2d3f]"}`}
        >
          Sell
        </button>
      </div>

      {/* Stock Select */}
      <select
        value={selectedStock}
        onChange={(e) => setSelectedStock(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-[#2d2d3f] text-white"
      >
        <option value="">Select Stock</option>
        {(tab === "buy" ? stocks : sellOptions).map((s) => (
          <option key={s.id} value={tab === "buy" ? s.symbol : s.stockSymbol}>
            {tab === "buy" ? `${s.symbol} - ${s.name} ($${s.price})` : `${s.stockSymbol} - ${s.quantity} shares`}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-[#2d2d3f] text-white"
      />

      <button
        onClick={handleTrade}
        className={`w-full p-2 rounded ${tab === "buy" ? "bg-[#00b894]" : "bg-[#d63031]"} hover:opacity-80`}
      >
        {tab === "buy" ? "Buy Stock" : "Sell Stock"}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
