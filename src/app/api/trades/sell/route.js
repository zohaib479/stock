import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // 1️⃣ Authenticate user
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 2️⃣ Parse request
    const body = await req.json();
    const { stock, quantity } = body;

    if (!stock || !quantity || quantity <= 0) {
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
    }

    // 3️⃣ Fetch stock
    const stockItem = await prisma.stock.findUnique({
      where: { symbol: stock },
    });

    if (!stockItem) {
      return new Response(JSON.stringify({ error: "Stock not found" }), { status: 404 });
    }

    // 4️⃣ Fetch user's portfolio
    const portfolioItem = await prisma.portfolio.findFirst({
      where: { userid: userId, stockid: stockItem.id },
    });

    if (!portfolioItem || portfolioItem.quantity < quantity) {
      return new Response(JSON.stringify({ error: "Not enough shares to sell" }), { status: 400 });
    }

    const totalValue = quantity * stockItem.price;

    // 5️⃣ Update portfolio
    if (portfolioItem.quantity === quantity) {
      // If selling all shares, remove portfolio item
      await prisma.portfolio.delete({ where: { id: portfolioItem.id } });
    } else {
      await prisma.portfolio.update({
        where: { id: portfolioItem.id },
        data: { quantity: portfolioItem.quantity - quantity },
      });
    }

    // 6️⃣ Update wallet (increment because user is getting money)
    await prisma.wallet.update({
      where: { userid: userId },
      data: { balance: { increment: totalValue } },
    });

    // 7️⃣ Record trade
    await prisma.trade.create({
      data: {
        userid: userId,
        stockid: stockItem.id,
        type: "sell",
        quantity,
        price: stockItem.price,
        total: totalValue,
      },
    });

    return new Response(
      JSON.stringify({ success: true, message: "Stock sold successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
