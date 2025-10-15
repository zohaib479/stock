import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt"; // JWT util

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token); // decoded.id me userId mil jayega
    const userId = decoded.id;

    const { amount } = await req.json();
    if (!amount) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    // Update wallet balance
    const updatedWallet = await prisma.wallet.update({
      where: { userid: userId },
      data: { balance: { increment: parsedAmount } },
    });

    // Record transaction
    await prisma.transaction.create({
      data: { userid: userId, type: "Deposit", amount: parsedAmount },
    });

    return NextResponse.json({ message: "Deposit successful", newBalance: updatedWallet.balance });
  } catch (err) {
    console.error("Deposit error:", err);
    return NextResponse.json({ error: "Failed to deposit" }, { status: 500 });
  }
}
