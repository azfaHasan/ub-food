export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatJam } from "@/lib/utils";
import MenuUserCard from "@/components/MenuUserCard";

interface DetailKantinUserPageProps {
  params: {
    id_kantin: string;
  };
}

export default async function DetailKantinUserPage({
  params,
}: DetailKantinUserPageProps) {
  
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
        </div>
        {daftarMenu.length === 0 ? (
          <p className="text-gray-500">Belum ada menu di kantin ini.</p>
        ) : (
          <ul className="space-y-4">
            {daftarMenu.map((menu) => (
              <MenuUserCard key={menu.id_menu} menu={menu} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}