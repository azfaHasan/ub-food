"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@prisma/client";
import { NAV_LINKS } from "@/lib/nav.config";
import LogoutButton from "@/components/LogoutButton";
import { useSession } from "next-auth/react";

function LoggedInNav({ role, avatarUrl }: { role: Role; avatarUrl?: string | null }) {
  const pathname = usePathname();
  const items = NAV_LINKS[role as Role] || [];
  const dashboardPath = role === Role.ADMIN ? '/admin' : role === Role.PENJUAL ? '/penjual' : '/user';

  return (
    <div className="flex items-center" style={{ columnGap: 60 }}>
      {items.map(({ label, href }) => {
        if (href === "/logout") {
          return (
            <div key={href}>
              <LogoutButton />
            </div>
          );
        }
        const active = (href !== '/logout' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className="text-white/95 hover:text-white transition-colors"
            style={{
              fontSize: 16,
              lineHeight: "28px",
              fontWeight: 600,
              opacity: active ? 1 : 0.95,
            }}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}

      <Link href={dashboardPath} title="Dashboard">
      <Image
        src={avatarUrl ?? "/assets/nav/avatar-default.jpg"}
        alt="Profile"
        width={28}
        height={28}
        className="rounded-full ring-2 ring-white/60"
      />
      </Link>
    </div>
  );
}

function LoggedOutNav() {
  return (
    <div className="flex items-center">
      <Link
        href="/login"
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
        Login
      </Link>
    </div>
  );
}

export default function Navbar() {

  const { data: session, status } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;
  const avatarUrl = session?.user?.image;

  let navContent = null;

  if (status === "loading") {
    navContent = null;
  } else if (session && role) {
    navContent = <LoggedInNav role={role} avatarUrl={avatarUrl} />;
  } else if (!session && pathname === "/") {
    navContent = <LoggedOutNav />;
  }
  if (!navContent) {
    return null;
  }

  return (
    <div
      className="w-full mt-4 rounded-[8px]"
      style={{
        height: 96,
        backgroundColor: "#3B81F4",
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
      }}
      role="navigation"
      aria-label="Main"
    >
      <div
        className="h-full mx-auto flex items-center justify-between"
        style={{ maxWidth: 1438, paddingLeft: 16, paddingRight: 16 }}
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/nav/logo.png"
            alt="UB Food"
            width={140}
            height={28}
            style={{ height: 28, width: "auto" }}
            priority
          />
        </Link>
        {navContent}
      </div>
    </div>
  );
}