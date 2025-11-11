// export const dynamic = 'force-dynamic';

// import { prisma } from "@/lib/prisma";
// import { notFound } from "next/navigation";
// import { formatJam } from "@/lib/utils";
// import MenuUserCard from "@/components/MenuUserCard";

// interface DetailKantinUserPageProps {
//   params: Promise<{
//     id_kantin: string;
//   }>;
// }

// export default async function DetailKantinUserPage({
//   params,
// }: DetailKantinUserPageProps) {

//   const paramsNew = await params;
  
//   const kantin = await prisma.kantin.findFirst({
//     where: {
//       id_kantin: paramsNew.id_kantin,
//     },
//     include: {
//       Penjual: {
//         select: { nama_penjual: true }
//       }
//     }
//   });

//   if (!kantin) {
//       notFound();
//   }

//   const daftarMenu = await prisma.menu.findMany({
//     where: {
//       id_kantin: paramsNew.id_kantin,
//     },
//     orderBy: {
//       nama_menu: 'asc' 
//     }
//   });

//   return (
//     <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
//       <section className="mb-6 p-6 bg-white shadow-md rounded-lg">
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <h1 className="text-3xl font-bold">{kantin.nama_kantin}</h1>
//             <p className="text-gray-500 font-medium">
//               Pemilik: {kantin.Penjual.nama_penjual}
//             </p>
//             <p className="text-gray-600 mt-2">
//               {kantin.deskripsi_kantin || "Tidak ada deskripsi."}
//             </p>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <p className="text-gray-800">
//             <strong>Lokasi:</strong> {kantin.lokasi || "Belum diatur"}
//           </p>
//           <p className="text-gray-800">
//             <strong>Jam Operasi:</strong> {formatJam(kantin.jam_buka)} - {formatJam(kantin.jam_tutup)}
//           </p>
//         </div>
//       </section>
//       <hr className="my-8" />
//       <section className="p-6 bg-white shadow-md rounded-lg">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold">Daftar Menu</h2>
//         </div>
//         {daftarMenu.length === 0 ? (
//           <p className="text-gray-500">Belum ada menu di kantin ini.</p>
//         ) : (
//           <ul className="space-y-4">
//             {daftarMenu.map((menu) => (
//               <MenuUserCard key={menu.id_menu} menu={menu} />
//             ))}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }


export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatJam } from "@/lib/utils";
import MenuUserCard from "@/components/MenuUserCard";
import Link from "next/link"; // Ditambahkan untuk breadcrumbs

interface DetailKantinUserPageProps {
  params: Promise<{
    id_kantin: string;
  }>;
}

export default async function DetailKantinUserPage({
  params,
}: DetailKantinUserPageProps) {

  const paramsNew = await params;
  
  const kantin = await prisma.kantin.findFirst({
    where: {
      id_kantin: paramsNew.id_kantin,
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
      id_kantin: paramsNew.id_kantin,
    },
    orderBy: {
      nama_menu: 'asc' 
    }
  });

  return (
    // Latar belakang gradien diubah menjadi biru
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 font-semibold truncate">
              {kantin.nama_kantin}
            </span>
          </nav>
        </div>

        {/* Header Card (Kantin Detail) - Gradien diubah menjadi biru */}
        <div className="mb-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                    {/* Ikon Kantin/Toko */}
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {kantin.nama_kantin}
                  </h1>
                  {/* Teks diubah menjadi biru-100 dan biru-200 */}
                  <p className="text-sm text-blue-100 font-medium mb-2">
                    Pemilik: {kantin.Penjual.nama_penjual}
                  </p>
                  <p className="text-sm text-blue-100">
                    {kantin.deskripsi_kantin || "Kantin ini belum memiliki deskripsi."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Info Grid (Lokasi & Jam Operasi) */}
        <div className="mb-6 grid sm:grid-cols-2 gap-4">
          {/* Lokasi Card - Warna ikon diubah */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 flex-shrink-0">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-500 mb-1">Lokasi</p>
                <p className="text-lg font-bold text-slate-900">
                  {kantin.lokasi || "Belum diatur"}
                </p>
              </div>
            </div>
          </div>
          {/* Jam Operasi Card - Warna ikon diubah */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-50 flex-shrink-0">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-500 mb-1">Jam Operasi</p>
                <p className="text-lg font-bold text-slate-900">
                  {formatJam(kantin.jam_buka)} - {formatJam(kantin.jam_tutup)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Menu Card - Gradien header diubah menjadi biru */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm">
                {/* Ikon Menu */}
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Daftar Menu</h2>
                <p className="text-sm text-slate-600">{daftarMenu.length} item ditemukan</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            {daftarMenu.length === 0 ? (
              // Tampilan jika menu kosong
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium text-center">
                  Belum ada menu di kantin ini.
                </p>
                <p className="text-sm text-slate-500 text-center">
                  Silakan cek kembali nanti.
                </p>
              </div>
            ) : (
              // Daftar menu
              <div className="space-y-4">
                {daftarMenu.map((menu) => (
                  <MenuUserCard key={menu.id_menu} menu={menu} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}