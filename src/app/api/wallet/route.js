import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const wallet = await prisma.wallet.findUnique({
      where: { userid: userId },
    });

    if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    return NextResponse.json({ balance: wallet.balance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
