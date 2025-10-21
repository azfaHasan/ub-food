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
  const role = params.role as string; // 'user' atau 'penjual'

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
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Register Sebagai {role}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Nama Lengkap:</label>
          <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} required />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        
        <button type="submit">Register</button>
      </form>
      <Link href="/">Sudah punya akun ?</Link>
    </div>
  );
}