"use client";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wallet") // or /api/trades/all for trade history
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Loading transactions...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#1e1e2f]">
            <th className="p-2">Type</th>
            <th className="p-2">Stock / Cash</th>
            <th className="p-2">Quantity / Amount</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="odd:bg-[#2d2d3f] even:bg-[#1b1b2b]">
              <td className="p-2">{tx.type}</td>
              <td className="p-2">{tx.stockSymbol || "Cash"}</td>
              <td className="p-2">{tx.quantity || tx.amount}</td>
              <td className="p-2">{new Date(tx.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
