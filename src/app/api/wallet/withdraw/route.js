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

    // Fetch wallet
    const wallet = await prisma.wallet.findUnique({ where: { userid: userId } });
    if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    if (wallet.balance < parsedAmount) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

    // Update wallet
    const updatedWallet = await prisma.wallet.update({
      where: { userid: userId },
      data: { balance: { decrement: parsedAmount } },
    });

    // Record transaction
    await prisma.transaction.create({
      data: { userid: userId, type: "Withdraw", amount: parsedAmount },
    });

    return NextResponse.json({ message: "Withdraw successful", newBalance: updatedWallet.balance });
  } catch (err) {
    console.error("Withdraw error:", err);
    return NextResponse.json({ error: "Failed to withdraw" }, { status: 500 });
  }
}
