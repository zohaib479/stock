import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your-secret-key"; // change in .env

// 🔹 Create a token
export function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

// 🔹 Verify a token
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    return null;
  }
}
