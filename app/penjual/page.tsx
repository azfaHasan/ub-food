// import { auth } from "@/auth";
// import { prisma } from "@/lib/prisma";
// import Link from "next/link";
// import { redirect } from "next/navigation";

// export default async function PenjualDashboardPage() {
  
//   const session = await auth();

//   if (!session?.penjual?.id) {
//     redirect("/login");
//   }

//   const penjualData = await prisma.penjual.findUnique({
//     where: { id_penjual: session.penjual.id },
//     include: {
//       Akun: { 
//         select: { username: true, email: true }
//       }
//     }
//   });

//   const daftarKantin = await prisma.kantin.findMany({
//     where: {
//       id_penjual: session.penjual.id
//     },
//     orderBy: {
//       nama_kantin: 'asc'
//     }
//   });

//   if (!penjualData || !penjualData.Akun) {
//     return <div>Data penjual tidak ditemukan.</div>;
//   }
//   return (
//     <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
//       <h1 className="text-3xl font-bold mb-4">
//         Selamat datang, {penjualData.Akun.username}
//       </h1>
      
//       <p className="mb-2">Nama Toko/Penjual: {penjualData.nama_penjual}</p>
//       <p className="mb-2">Email: {penjualData.Akun.email}</p>
//       <p className="mb-6">Nomor HP: {penjualData.no_hp_penjual || "Belum diisi"}</p>

//       <Link href="/penjual/profile" className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
//         Edit Profile
//       </Link>
//       <section className="p-6 bg-white shadow-md rounded-lg">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold">Kantin Anda</h2>
//           <Link href="/penjual/kantin/create">
//             <button
//               className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
//             >
//               + Buat Kantin Baru
//             </button>
//           </Link>
//         </div>

//         {daftarKantin.length === 0 ? (
//           <p className="text-gray-500">Anda belum memiliki kantin. Silakan buat kantin baru.</p>
//         ) : (
//           <ul className="space-y-4">
//             {daftarKantin.map((kantin) => (
//               <li
//                 key={kantin.id_kantin}
//                 className="flex justify-between items-center border border-gray-200 p-4 rounded-lg"
//               >
//                 <div>
//                   <h3 className="text-xl font-semibold text-black-800">{kantin.nama_kantin}</h3>
//                   <small className="text-gray-500">{kantin.lokasi || "Lokasi belum diatur"}</small>
//                 </div>
//                 <Link 
//                   href={`/penjual/kantin/${kantin.id_kantin}`}
//                   className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//                 >
//                   Kelola Kantin
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PenjualDashboardPage() {
  
  const session = await auth();

  if (!session?.penjual?.id) {
    redirect("/login");
  }

  const penjualData = await prisma.penjual.findUnique({
    where: { id_penjual: session.penjual.id },
    include: {
      Akun: { 
        select: { username: true, email: true }
      }
    }
  });

  const daftarKantin = await prisma.kantin.findMany({
    where: {
      id_penjual: session.penjual.id
    },
    orderBy: {
      nama_kantin: 'asc'
    }
  });

  if (!penjualData || !penjualData.Akun) {
    return <div>Data penjual tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm shadow-2xl border-4 border-white/30">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500 border-4 border-white shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Seller Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Selamat datang, Penjual! 
                  </h1>
                  <p className="text-xl font-semibold text-white/90 mb-3">
                    {penjualData.nama_penjual}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      @{penjualData.Akun.username}
                    </span>
                    <span className="px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm text-white rounded-full">
                      🏪 Penjual
                    </span>
                    <span className="px-3 py-1 text-sm font-medium bg-blue-400/30 backdrop-blur-sm text-white rounded-full">
                      {daftarKantin.length} Kantin
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <Link
                  href="/penjual/profile"
                  className="self-start lg:self-center inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md whitespace-nowrap group"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              <div className="px-8 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">Email</p>
                    <p className="text-base font-semibold text-slate-900 truncate">
                      {penjualData.Akun.email}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="px-8 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">Nomor HP</p>
                    {penjualData.no_hp_penjual ? (
                      <p className="text-base font-semibold text-slate-900">{penjualData.no_hp_penjual}</p>
                    ) : (
                      <p className="text-base font-medium text-slate-400 italic">Belum diisi</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-8 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-50 flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Kantin</p>
                    <p className="text-base font-semibold text-slate-900">
                      {daftarKantin.length} Kantin
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 bg-slate-50">
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
                <div className="text-xs text-slate-600 font-medium">Menu Aktif</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
                <div className="text-xs text-slate-600 font-medium">Pesanan</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">0</div>
                <div className="text-xs text-slate-600 font-medium">Review</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">Rp 0</div>
                <div className="text-xs text-slate-600 font-medium">Pendapatan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Kantin Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  Kantin Anda
                </h2>
                <p className="text-slate-600 mt-1 ml-13">
                  Kelola semua kantin yang Anda miliki
                </p>
              </div>
              <Link 
                href="/penjual/kantin/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md whitespace-nowrap group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Buat Kantin Baru</span>
              </Link>
            </div>
          </div>

          <div className="p-8">
            {daftarKantin.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-4">
                  <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum Ada Kantin</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Anda belum memiliki kantin. Mulai bisnis Anda dengan membuat kantin pertama sekarang!
                </p>
                <Link 
                  href="/penjual/kantin/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Buat Kantin Pertama</span>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {daftarKantin.map((kantin) => (
                  <div
                    key={kantin.id_kantin}
                    className="group relative bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {kantin.nama_kantin}
                          </h3>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="font-medium">{kantin.lokasi || "Lokasi belum diatur"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 sm:flex-shrink-0">
                        <Link 
                          href={`/penjual/kantin/${kantin.id_kantin}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md whitespace-nowrap group/btn"
                        >
                          <span>Kelola Kantin</span>
                          <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}