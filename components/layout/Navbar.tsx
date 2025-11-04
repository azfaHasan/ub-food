"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@prisma/client";
import { NAV_LINKS } from "@/lib/nav.config";
import LogoutButton from "@/components/LogoutButton";
import { useSession } from "next-auth/react";

export default function Navbar() {

  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const avatarUrl = session?.user?.image;

  if (status === "loading") {
    return null;
  }

  if (!session || !role) {
    return null;
  }

  const items = NAV_LINKS[role as Role] || [];

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
          <Image
            src={avatarUrl ?? "/assets/nav/avatar-default.jpg"} // Pastikan ini ada di public
            alt="Profile"
            width={28}
            height={28}
            className="rounded-full ring-2 ring-white/60"
          />
        </div>
      </div>
    </div>
  );
}