"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#1b1b2b] p-6 flex flex-col gap-4">
      <Link href="/" className="hover:text-[#00b894] text-white">Dashboard</Link>
      <Link href="/portfolio" className="hover:text-[#00b894] text-white">Portfolio</Link>
      <Link href="/trade" className="hover:text-[#00b894] text-white">Trade</Link>
      <Link href="/transactions" className="hover:text-[#00b894] text-white">Transactions</Link>
    </aside>
  );
}
