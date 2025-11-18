import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const userId = decoded.id;
    // Fetch only this user's transactions
    const transactions = await prisma.transaction.findMany({
      where: { userid: userId },
      orderBy: { createdat: "desc" },
    });
    return NextResponse.json(transactions);
  } catch (err) {
    console.error("Fetch transactions error:", err);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
