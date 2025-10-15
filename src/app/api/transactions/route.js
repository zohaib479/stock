// ✅ app/api/transactions/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // ✅ Correct import

export async function GET(req) {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdat: "desc" },
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
