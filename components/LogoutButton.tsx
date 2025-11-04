"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-white/95 hover:text-white transition-colors"
      style={{
        fontSize: 16,
        lineHeight: "28px",
        fontWeight: 600,
        opacity: 0.95,
        background: 'none',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      Logout
    </button>
  );
}