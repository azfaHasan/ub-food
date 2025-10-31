"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const params = useParams();
  const router = useRouter();
  const role = params.role as string; // user atau penjual

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (role === 'user' && !email.endsWith('@ub.ac.id')) {
      setError("Silahkan Gunakan Email Universitas Brawijaya!");
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password,
          nama,
          role: role.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Terjadi kesalahan.");
      } else {
        setSuccess("Registrasi berhasil! Silakan login.");
        setEmail("");
        setUsername("");
        setPassword("");
        setNama("");
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (err) {
      setError("Gagal terhubung ke server.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="bg-[#A5C5FA] w-1/3 px-18 py-8 rounded-lg">
        <h1 className="text-5xl font-bold mb-8 text-center">UB Food</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3B81F4] bg-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3B81F4] bg-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3B81F4] bg-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nama Lengkap:</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3B81F4] bg-gray-300"
            />
          </div>

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          {success && <p className="text-green-600 text-sm font-medium">{success}</p>}

          <button
            type="submit"
            className="w-full bg-[#3B81F4] text-white rounded-md text-sm py-3 font-medium hover:bg-[#2563eb] transition-colors mt-5"
          >
            Register
          </button>
        </form>

        <Link href="/login" className="block text-left text-xs font-bold mt-4 hover:underline">
          Sudah punya akun?
        </Link>
      </div>
    </div>
  );
}