"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setMessage(data.error || "Registration successful!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f111a] text-white">
      <div className="bg-[#1e1e2f] p-10 rounded-lg shadow-lg w-[400px]">
        <h1 className="text-2xl font-bold mb-6 text-center">Investor Register</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#2d2d3f]"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#2d2d3f]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 rounded bg-[#2d2d3f]"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-[#00b894] hover:bg-green-500 p-2 rounded font-semibold"
        >
          Register
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
