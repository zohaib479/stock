import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, password } = await req.json();
// Check user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
// Check password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
//Generate JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
// Return token + user info
  return new Response(JSON.stringify({ token, user }), { status: 200 });
}
