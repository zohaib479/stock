"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function PortfolioPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const res = await fetch("/api/portfolio", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch portfolio");

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (!data) return <p className="text-center mt-10 text-lg">No portfolio data found.</p>;

  //  total portfolio value
  const totalPortfolioValue = data.portfolio.reduce(
    (sum, s) => sum + parseFloat(s.currentValue),
    0
  );

  //  Pie chart data for vizualization
  const pieData = data.portfolio.map((s) => ({
    name: s.stockSymbol,
    value: parseFloat(s.currentValue),
  }));
  const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#ef4444", "#a855f7", "#14b8a6"];

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center text-white"
      >
         My Portfolio Dashboardd
      </motion.h1>

      {/* USER + WALLET CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 max-w-xl mx-auto text-center"
      >
        <p className="text-xl  font-semibold text-white">{data.user?.name}</p>
        <p className="text-white">{data.user?.email}</p>
        <p className="mt-3 text-lg text-white font-medium">
          $$ Wallet Balance:{" "}
          <span className="text-green-600 font-bold">${data.wallet?.balance ?? 0}</span>
        </p>
        <p className="mt-1 text-white">
          📈 Portfolio Value:{" "}
          <span className="text-blue-600 font-bold">${totalPortfolioValue.toFixed(2)}</span>
        </p>
      </motion.div>

      {/* PORTFOLIO HOLDINGS */}
      <h2 className="text-2xl font-semibold mb-4 text-white">Your Holdings</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.portfolio.map((stock, index) => (
          <motion.div
            key={stock.stockId}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-2xl text-white shadow-md p-5 border border-gray-100 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-white">{stock.stockSymbol}</h3>
              <span
                className={`text-sm font-semibold ${
                  stock.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stock.profitLoss >= 0 ? "▲" : "▼"} {stock.profitPercent}%
              </span>
            </div>
            <p className="text-white">{stock.stockName}</p>
            <p className="mt-2 text-white">
              Quantity: <span className="font-semibold">{stock.quantity}</span>
            </p>
            <p className="text-white">
              Avg Price: <span className="font-semibold">${stock.avgPrice}</span>
            </p>
            <p className="text-white">
              Current Price: <span className="font-semibold">${stock.currentPrice}</span>
            </p>
            <p className="mt-2 text-gray-800 font-medium">
              Current Value: ${stock.currentValue}
            </p>
            <p
              className={`text-sm mt-1 font-semibold ${
                stock.profitLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stock.profitLoss >= 0 ? "Profit" : "Loss"}: ${stock.profitLoss}
            </p>
          </motion.div>
        ))}
      </div>

      {/* PIE CHART */}
      <div className="mt-12 bg-gray-800 rounded-2xl shadow-md p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center text-white">Portfolio Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* TRADE HISTORY */}
      <div className="mt-12 bg-gray-800 rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Trade History</h2>
        {data.tradeHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white text-sm">
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Symbol</th>
                  <th className="py-2 px-3">Qty</th>
                  <th className="py-2 px-3">Price</th>
                  <th className="py-2 px-3">Total</th>
                  <th className="py-2 px-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.tradeHistory.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b text-sm text-white hover:bg-gray-900 transition"
                  >
                    <td
                      className={`py-2 px-3 font-semibold ${
                        t.type === "buy" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type.toUpperCase()}
                    </td>
                    <td className="py-2 px-3">{t.stockSymbol}</td>
                    <td className="py-2 px-3">{t.quantity}</td>
                    <td className="py-2 px-3">${t.price}</td>
                    <td className="py-2 px-3">${t.total}</td>
                    <td className="py-2 px-3">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No trades yet.</p>
        )}
      </div>
    </div>
  );
}
