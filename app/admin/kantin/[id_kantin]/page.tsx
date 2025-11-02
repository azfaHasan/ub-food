export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import MenuListItem from "@/components/MenuListItem";

interface DetailKantinPageProps {
  params: {
    id_kantin: string;
  };
}

function formatJam(date: Date | null): string {
  if (!date) return "Belum diatur";
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export default async function AdminDetailKantinPage({
  params,
}: DetailKantinPageProps) {

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  if (session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const kantin = await prisma.kantin.findFirst({
    where: {
      id_kantin: params.id_kantin,
    },
    include: {
      Penjual: {
        select: { nama_penjual: true }
      }
    }
  });

  if (!kantin) {
      notFound();
  }

  const daftarMenu = await prisma.menu.findMany({
    where: {
      id_kantin: params.id_kantin,
    },
    orderBy: {
      nama_menu: 'asc' 
    }
  });

  const baseUrl = `/admin/kantin/${params.id_kantin}`;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <section className="mb-6 p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold">{kantin.nama_kantin}</h1>
            <p className="text-gray-500 font-medium">
              Pemilik: {kantin.Penjual.nama_penjual}
            </p>
            <p className="text-gray-600 mt-2">
              {kantin.deskripsi_kantin || "Tidak ada deskripsi."}
            </p>
          </div>
          <Link
            href={`/admin/kantin/${kantin.id_kantin}/profile`}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 whitespace-nowrap"
          >
            Edit Profile Kantin
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-gray-800">
            <strong>Lokasi:</strong> {kantin.lokasi || "Belum diatur"}
          </p>
          <p className="text-gray-800">
            <strong>Jam Operasi:</strong> {formatJam(kantin.jam_buka)} - {formatJam(kantin.jam_tutup)}
          </p>
        </div>
      </section>

      <hr className="my-8" />
      <section className="p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Daftar Menu</h2>
          <Link href={`${baseUrl}/add-menu`}>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
            >
              + Tambah Menu Baru
            </button>
          </Link>
        </div>

        {daftarMenu.length === 0 ? (
          <p className="text-gray-500">Belum ada menu di kantin ini.</p>
        ) : (
          <ul className="space-y-4">
            {daftarMenu.map((menu) => (
              <MenuListItem 
                key={menu.id_menu} 
                menu={menu} 
                baseUrl={baseUrl} 
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}