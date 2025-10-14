"use client";
import StockCard from "./components/StockCard";
import PortfolioChart from "./components/PortFolioChart";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, Investor!</h2>
      
      <section>
        <h3 className="text-xl font-semibold mb-2">Your Portfolio</h3>
        <PortfolioChart />
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Top Stocks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StockCard stock={{ name: "AAPL", price: 150, change: "+1.2%" }} />
          <StockCard stock={{ name: "TSLA", price: 720, change: "-0.8%" }} />
          <StockCard stock={{ name: "AMZN", price: 3400, change: "+0.5%" }} />
        </div>
      </section>
    </div>
  );
}
