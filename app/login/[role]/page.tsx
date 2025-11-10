"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const InputField = ({
  label,
  type,
  value,
  onChange,
  required
}: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-white mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B81F4] focus:border-transparent"
    />
  </div>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  const role = params.role as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
      role: role.toUpperCase(),
    });
    
    if (result?.error) {
      setLoading(false);
      setError("Email atau password salah, atau role tidak sesuai.");
    } else if (result?.ok || role == 'user') {
      router.push(`/`);
    } else if (result?.ok) {
      router.push(`/${role}`);
    } 
  };

  if (loading) {
    return (
      <div className="mx-auto rounded-xl my-14 px-16 flex items-center flex-col bg-[#A5C5FA] py-20 w-full max-w-md">
        <h1 className="text-5xl font-bold mb-2">UB Food</h1>
        <div className="w-full text-center py-20">
          <p className="text-xl font-semibold text-gray-800 animate-pulse">
            Memverifikasi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto rounded-xl my-14 px-16 flex items-center flex-col bg-[#A5C5FA] py-20 w-full max-w-md">
      <h1 className="text-5xl font-bold mb-2">UB Food</h1>

      <form onSubmit={handleSubmit} className="w-full">
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3B81F4] hover:bg-[#2563eb] disabled:bg-gray-400 disabled:cursor-not-allowed text-white mt-4 rounded-md text-sm font-medium py-3 transition-colors"
        >
          {loading ? "Loading..." : "Login"}
        </button>
        
        <Link
          href="/register"
          className="text-white hover:underline font-bold text-sm mt-2 block text-left"
        >
          Belum ada akun?
        </Link>
      </form>
      </div>
  );
}