"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("token", data.token);
      router.push("/portfolio");
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0f111a]">
      <div className="bg-[#1e1e2f] p-8 rounded shadow-md w-96 text-white">
        <h2 className=" text-white text-2xl font-bold mb-6">Investor Login</h2>
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
          className="w-full p-2 mb-4 rounded bg-[#2d2d3f]"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-[#00b894] p-2 rounded hover:bg-green-500"
        >
          Login
        </button>
        <p className="text-white text-center font-bold">Don't have an account </p>
        <button onClick={()=>{
            window.location.href='/register'
        }} className="w-full bg-[#0053b8] p-2 rounded hover:bg-blue-500">Register Now </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
