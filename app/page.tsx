// export const dynamic = 'force-dynamic';

// import Link from "next/link";
// import { prisma } from "@/lib/prisma";
// import { formatJam } from "@/lib/utils";
// import { Prisma } from "@prisma/client";

// const kantinQueryArgs = {
//   include: {
//     Penjual: {
//       select: { nama_penjual: true },
//     },
//   },
//   orderBy: {
//     nama_kantin: 'asc' as const,
//   }
// };

// type KantinWithPenjual = Prisma.KantinGetPayload<typeof kantinQueryArgs>;

// function KantinCard({ kantin }: { kantin: KantinWithPenjual }) {
//   return (
//     <Link 
//       href={`/kantin/${kantin.id_kantin}`}
//       className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors"
//     >
//       <h3 className="text-2xl font-bold tracking-tight text-gray-900">
//         {kantin.nama_kantin}
//       </h3>
//       <p className="font-normal text-gray-500 mt-1">
//         Pemilik: {kantin.Penjual.nama_penjual}
//       </p>
//       <p className="font-normal text-gray-700 mt-2">
//         {kantin.lokasi || "Lokasi belum diatur"}
//       </p>
//       <p className="text-sm text-gray-600 mt-2">
//         Jam Buka: {formatJam(kantin.jam_buka)} - {formatJam(kantin.jam_tutup)}
//       </p>
//     </Link>
//   );
// }

// export default async function HomePage() {
  
//   const daftarKantin = await prisma.kantin.findMany(kantinQueryArgs);

//   return (
//     <div className="p-5"> 
//       <main className="mt-10">
//         <h2 className="text-2xl font-semibold text-center">
//           Selamat Datang di Halaman Home!
//         </h2>
//         <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
//             <h1 className="text-4xl font-bold text-center mb-12">
//               Pilih Kantin
//             </h1>

//             {daftarKantin.length === 0 ? (
//               <p className="text-center text-gray-500">
//                 Belum ada kantin yang terdaftar.
//               </p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {daftarKantin.map((kantin) => (
//                   <KantinCard key={kantin.id_kantin} kantin={kantin} />
//                 ))}
//               </div>
//             )}
//         </div>
//       </main>
//     </div>
//   );
// }


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

/**
 * Komponen KantinCard yang telah didesain ulang
 * Menggunakan gaya dari referensi: rounded-2xl, shadow-sm, border,
 * dan tata letak internal dengan ikon.
 */
function KantinCard({ kantin }: { kantin: KantinWithPenjual }) {
  return (
    <Link 
      href={`/kantin/${kantin.id_kantin}`}
      className="block p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Bagian Header Kartu (Ikon, Nama Kantin, Penjual) */}
      <div className="flex items-start gap-4 mb-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 flex-shrink-0">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 truncate" title={kantin.nama_kantin}>
            {kantin.nama_kantin}
          </h3>
          <p className="text-sm font-medium text-slate-600">
            Oleh: {kantin.Penjual.nama_penjual}
          </p>
        </div>
      </div>
      
      {/* Bagian Lokasi */}
      <p className="font-normal text-slate-700 mt-3 text-sm min-h-[40px] break-words">
        {kantin.lokasi || "Lokasi belum diatur"}
      </p>
      
      {/* Bagian Jam Operasi (dipisahkan dengan border) */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Jam Operasi</span>
          <span className="font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
            {formatJam(kantin.jam_buka)} - {formatJam(kantin.jam_tutup)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  
  const daftarKantin = await prisma.kantin.findMany(kantinQueryArgs);

  return (
    // Latar belakang gradien diterapkan di root
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      
      {/* Kontainer utama dengan padding dan max-width */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Kartu Header Utama (diambil dari gaya referensi) */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                    {/* Ikon "Toko" atau "Belanja" */}
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Pilih Kantin
                  </h1>
                  <p className="text-sm text-purple-100">
                    Jelajahi semua kantin yang tersedia dan temukan menu favorit Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Konten Utama (Grid Kantin atau Status Kosong) */}
        {daftarKantin.length === 0 ? (
          // Status Kosong yang Didesain Ulang
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium text-center">
                Belum ada kantin yang terdaftar.
              </p>
              <p className="text-sm text-slate-500 text-center">
                Silakan kembali lagi nanti.
              </p>
            </div>
          </div>
        ) : (
          // Grid untuk KantinCard
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {daftarKantin.map((kantin) => (
              <KantinCard key={kantin.id_kantin} kantin={kantin} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}