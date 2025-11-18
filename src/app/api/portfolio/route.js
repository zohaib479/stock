import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing token" }), {
        status: 401,
      });}
    const token = authHeader.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ error: "Invalid token format" }), {
        status: 401,
      });}
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification failed:", err);
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 403,
      });
    }
    const userId = decoded.id; //jwt token decoding
    console.log("✅ Authenticated user ID:", userId);
//using joins inner/equi joins
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Wallet: true },
    });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
//one more join use kia
    const portfolio = await prisma.portfolio.findMany({
      where: { userid: userId },
      include: { Stock: true },
    });
    const holdings = portfolio.map((p) => {
      const totalInvested = p.quantity * p.avgprice;
      const currentValue = p.quantity * p.Stock.price;
      const profitLoss = currentValue - totalInvested;
      const profitPercent = ((profitLoss / totalInvested) * 100).toFixed(2);
      return {
        stockId: p.Stock.id,
        stockSymbol: p.Stock.symbol,
        stockName: p.Stock.name,
        quantity: p.quantity,
        avgPrice: p.avgprice,
        currentPrice: p.Stock.price,
        totalInvested: totalInvested.toFixed(2),
        currentValue: currentValue.toFixed(2),
        profitLoss: profitLoss.toFixed(2),
        profitPercent: isFinite(profitPercent) ? profitPercent : "0.00",
      };
    });
//join ik or
    const trades = await prisma.trade.findMany({
      where: { userid: userId },
      include: { Stock: true },
      orderBy: { createdat: "desc" },
    });
    const history = trades.map((t) => ({
      id: t.id,
      type: t.type,
      stockSymbol: t.Stock.symbol,
      quantity: t.quantity,
      price: t.price,
      total: t.total,
      createdAt: t.createdat,
    }));
    const response = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      wallet: {
        balance: user.Wallet?.balance ?? 0,
      },
      portfolio: holdings,
      tradeHistory: history,
    };
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("❌ Portfolio fetch failed:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}