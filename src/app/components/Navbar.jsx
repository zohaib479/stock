"use client";
export default function Navbar() {
  return (
    <nav className="bg-[#1e1e2f] text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">StockSim</h1>
      <div className="space-x-4">
        <button className="px-3 py-1 bg-[#00b894] rounded hover:bg-green-500">Profile</button>
        <button className="px-3 py-1 bg-[#d63031] rounded hover:bg-red-500">Logout</button>
      </div>
    </nav>
  );
}
