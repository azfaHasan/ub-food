import { Role } from "@prisma/client";

type NavItem = {
  label: string;
  href: string;
};

export const NAV_LINKS: Record<Role, NavItem[]> = {
  [Role.USER]: [
    { label: "Riwayat", href: "/user/riwayat" },
    { label: "Notifikasi", href: "/user/notifikasi" },
    { label: "Keranjang", href: "/user/keranjang" },
    { label: "Logout", href: "/logout" },
  ],
  [Role.PENJUAL]: [
    { label: "Riwayat", href: "/penjual/riwayat" },
    { label: "Notifikasi", href: "/penjual/notifikasi" },
    { label: "Logout", href: "/logout" },
  ],
  [Role.ADMIN]: [
    { label: "Dashboard", href: "/admin" },
    { label: "Logout", href: "/logout" },
  ],
};