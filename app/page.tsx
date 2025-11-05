export const dynamic = 'force-dynamic';

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatJam } from "@/lib/utils";
import { Prisma } from "@prisma/client";

const kantinQueryArgs = {
  include: {
    Penjual: {
      select: { nama_penjual: true },
    },
  },
  orderBy: {
    nama_kantin: 'asc' as const,
  }
};

type KantinWithPenjual = Prisma.KantinGetPayload<typeof kantinQueryArgs>;

function KantinCard({ kantin }: { kantin: KantinWithPenjual }) {
  return (
    <Link 
      href={`/kantin/${kantin.id_kantin}`}
      className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors"
    >
      <h3 className="text-2xl font-bold tracking-tight text-gray-900">
        {kantin.nama_kantin}
      </h3>
      <p className="font-normal text-gray-500 mt-1">
        Pemilik: {kantin.Penjual.nama_penjual}
      </p>
      <p className="font-normal text-gray-700 mt-2">
        {kantin.lokasi || "Lokasi belum diatur"}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        Jam Buka: {formatJam(kantin.jam_buka)} - {formatJam(kantin.jam_tutup)}
      </p>
    </Link>
  );
}

export default async function HomePage() {
  
  const daftarKantin = await prisma.kantin.findMany(kantinQueryArgs);

  return (
    <div className="p-5"> 
      <main className="mt-10">
        <h2 className="text-2xl font-semibold text-center">
          Selamat Datang di Halaman Home!
        </h2>
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl font-bold text-center mb-12">
              Pilih Kantin
            </h1>

            {daftarKantin.length === 0 ? (
              <p className="text-center text-gray-500">
                Belum ada kantin yang terdaftar.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {daftarKantin.map((kantin) => (
                  <KantinCard key={kantin.id_kantin} kantin={kantin} />
                ))}
              </div>
            )}
        </div>
      </main>
    </div>
  );
}