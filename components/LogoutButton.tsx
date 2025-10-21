"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ 
        callbackUrl: '/' // Redirect ke halaman login selection
      })}
    >
      Logout
    </button>
  );
}