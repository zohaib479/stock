"use client";
import { useEffect, useState } from "react";
import StockCard from "./components/StockCard";
import PortfolioChart from "./components/PortFolioChart";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const res = await fetch("/api/stocks");
        const data = await res.json();
        setStocks(data);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStocks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 md:p-10 space-y-8">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          📈 Stock Market Dashboard
        </h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg">
          Track live stock trends and prices
        </p>
      </header>

      {/* Portfolio Chart */}
      <section className="bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4">Market Overview</h3>
        <PortfolioChart />
      </section>

      {/* Stocks Grid */}
      <section>
        <h3 className="text-xl sm:text-2xl font-semibold mb-4">Available Stocks</h3>
        {loading ? (
          <p className="text-gray-400 text-center animate-pulse">Loading stocks...</p>
        ) : stocks.length === 0 ? (
          <p className="text-gray-400 text-center">No stocks available in the market.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {stocks.map((stock) => (
              <StockCard
                key={stock.id}
                stock={{
                  name: stock.name,
                  symbol: stock.symbol,
                  price: stock.price.toFixed(2),
                  change: `${(Math.random() * 2 - 1).toFixed(2)}%`,
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 mt-8 text-sm sm:text-base">
        © {new Date().getFullYear()} StockX || DB Project  
      </footer>
    </div>
  );
}
