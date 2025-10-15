"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TradePage() {
  const [tab, setTab] = useState("buy");
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

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
    if (!token) return setMessage("⚠️ Please log in to trade.");

    const endpoint = tab === "buy" ? "/api/trades/buy" : "/api/trades/sell";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stock: selectedStock, quantity: Number(quantity) }),
    });

    const data = await res.json();
    setMessage(data.error || "✅ Trade executed successfully!");
    setQuantity("");
  };

  const sellOptions = portfolio.filter((p) => p.quantity > 0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-6 text-center tracking-wide">
          Trade Stocks
        </h1>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-700">
          {["buy", "sell"].map((type) => (
            <button
              key={type}
              onClick={() => setTab(type)}
              className={`flex-1 py-3 text-lg font-semibold transition-all duration-300 ${
                tab === type
                  ? type === "buy"
                    ? "bg-green-500/20 text-green-400 border-b-2 border-green-400"
                    : "bg-red-500/20 text-red-400 border-b-2 border-red-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {type === "buy" ? "Buy" : "Sell"}
            </button>
          ))}
        </div>

        {/* Stock Select */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Select Stock
            </label>
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#1e293b] text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Choose stock</option>
              {(tab === "buy" ? stocks : sellOptions).map((s) => (
                <option
                  key={s.id}
                  value={tab === "buy" ? s.symbol : s.stockSymbol}
                >
                  {tab === "buy"
                    ? `${s.symbol} — ${s.name} ($${s.price})`
                    : `${s.stockSymbol} — ${s.quantity} shares`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">Quantity</label>
            <input
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#1e293b] text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleTrade}
            className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
              tab === "buy"
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {tab === "buy" ? "Buy Stock" : "Sell Stock"}
          </motion.button>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`mt-6 text-center font-medium ${
              message.includes("error") || message.includes("⚠️")
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {message}
          </p>
        )}
      </motion.div>
    </div>
  );
}
