import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { stock, quantity } = await req.json();
    if (!stock || !quantity || quantity <= 0)
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
    const stockItem = await prisma.stock.findUnique({ where: { symbol: stock } });
    if (!stockItem)
      return new Response(JSON.stringify({ error: "Stock not found" }), { status: 404 });
    const totalCost = quantity * stockItem.price;
    const wallet = await prisma.wallet.findUnique({ where: {userid: userId } });
    if (!wallet || wallet.balance < totalCost)
      return new Response(JSON.stringify({ error: "Insufficient balance" }), { status: 400 });
    //join
   await prisma.wallet.update({
  where: { userid: userId },
  data: { balance: { decrement: totalCost } },
});
    const existingPortfolio = await prisma.portfolio.findFirst({
      where: { userid: userId, stockid: stockItem.id },
    });
    if (existingPortfolio) {
      const newQuantity = existingPortfolio.quantity + quantity;
      const newAvgPrice =
        (existingPortfolio.avgPrice * existingPortfolio.quantity + totalCost) / newQuantity;
      await prisma.portfolio.update({
  where: { id: existingPortfolio.id },
  data: { 
    quantity: newQuantity, 
    avgprice: newAvgPrice
  },
});
    } else {
// Create new portfolio 
      await prisma.portfolio.create({
        data: {
          userid: userId,
          stockid: stockItem.id,
          quantity,
          avgprice: stockItem.price,
        },
      });
    }
    //insert into trade where userid=xyz + joins used
    await prisma.trade.create({
      data: {
        userid:userId,
        stockid: stockItem.id,
        type: "buy",
        quantity,
        price: stockItem.price,
        total: totalCost,
      },
    });
    return new Response(
      JSON.stringify({ success: true, message: "Stock purchased successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
