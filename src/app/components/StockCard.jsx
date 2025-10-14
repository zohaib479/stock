"use client";
export default function StockCard({ stock }) {
  return (
    <div className="bg-[#2d2d3f] p-4 rounded shadow hover:scale-105 transition-transform">
      <h4 className="font-bold text-lg">{stock.name}</h4>
      <p>Price: ${stock.price}</p>
      <p className={stock.change.startsWith("+") ? "text-green-400" : "text-red-500"}>
        {stock.change}
      </p>
    </div>
  );
}
