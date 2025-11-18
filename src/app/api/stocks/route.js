import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all stocks from your "Stock" table
    //select * from stock
    const stocks = await prisma.stock.findMany({
      select: {
        id: true,
        symbol: true,
        name: true,
        price: true,
      },
    });

    return NextResponse.json(stocks, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching stocks:", error);
    return NextResponse.json({ error: "Failed to fetch stocks" }, { status: 500 });
  }
}
