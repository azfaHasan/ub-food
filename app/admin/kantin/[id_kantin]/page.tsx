// export const dynamic = 'force-dynamic';

// import { prisma } from "@/lib/prisma";
// import { auth } from "@/auth";
// import { Role } from "@prisma/client";
// import { notFound, redirect } from "next/navigation";
// import Link from "next/link";
// import MenuListItem from "@/components/MenuListItem";

// interface DetailKantinPageProps {
//   params: {
//     id_kantin: string;
//   };
// }

// function formatJam(date: Date | null): string {
//   if (!date) return "Belum diatur";
//   return new Date(date).toLocaleTimeString("id-ID", {
//     hour: "2-digit",
//     minute: "2-digit",
//     timeZone: "UTC",
//   });
// }

// export default async function AdminDetailKantinPage({
//   params,
// }: DetailKantinPageProps) {

//   const session = await auth();
//   if (!session?.user?.id) {
//     redirect("/login");
//   }
//   if (session.user.role !== Role.ADMIN) {
//     redirect("/");
//   }

//   const kantin = await prisma.kantin.findFirst({
//     where: {
//       id_kantin: params.id_kantin,
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
//       id_kantin: params.id_kantin,
//     },
//     orderBy: {
//       nama_menu: 'asc' 
//     }
//   });

//   const baseUrl = `/admin/kantin/${params.id_kantin}`;

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
//           <Link
//             href={`/admin/kantin/${kantin.id_kantin}/profile`}
//             className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 whitespace-nowrap"
//           >
//             Edit Profile Kantin
//           </Link>
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
//           <Link href={`${baseUrl}/add-menu`}>
//             <button
//               className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
//             >
//               + Tambah Menu Baru
//             </button>
//           </Link>
//         </div>

//         {daftarMenu.length === 0 ? (
//           <p className="text-gray-500">Belum ada menu di kantin ini.</p>
//         ) : (
//           <ul className="space-y-4">
//             {daftarMenu.map((menu) => (
//               <MenuListItem 
//                 key={menu.id_menu} 
//                 menu={menu} 
//                 baseUrl={baseUrl} 
//               />
//             ))}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/admin" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Dashboard
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 font-semibold">Detail Kantin</span>
          </nav>
        </div>

        {/* Kantin Profile Card */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {kantin.nama_kantin}
                    </h1>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm font-medium text-white">
                          {kantin.Penjual.nama_penjual}
                        </span>
                      </div>
                    </div>
                    <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
                      {kantin.deskripsi_kantin || "Tidak ada deskripsi."}
                    </p>
                  </div>
                </div>
                
                <Link
                  href={`/admin/kantin/${kantin.id_kantin}/profile`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md whitespace-nowrap group"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              <div className="px-8 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">Lokasi Kantin</p>
                    <p className="text-lg font-semibold text-slate-900 truncate">
                      {kantin.lokasi || "Belum diatur"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="px-8 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-green-50 flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">Jam Operasi</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {formatJam(kantin.jam_buka)} - {formatJam(kantin.jam_tutup)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  Daftar Menu
                </h2>
                <p className="text-slate-600 mt-1 ml-13">
                  {daftarMenu.length} menu tersedia
                </p>
              </div>
              <Link 
                href={`${baseUrl}/add-menu`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md whitespace-nowrap group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah Menu Baru</span>
              </Link>
            </div>
          </div>

          <div className="p-8">
            {daftarMenu.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-50 mb-4">
                  <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum Ada Menu</h3>
                <p className="text-slate-600 mb-6">Belum ada menu di kantin ini. Tambahkan menu pertama sekarang!</p>
                <Link 
                  href={`${baseUrl}/add-menu`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Tambah Menu Pertama</span>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {daftarMenu.map((menu) => (
                  <MenuListItem 
                    key={menu.id_menu} 
                    menu={menu} 
                    baseUrl={baseUrl} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 

