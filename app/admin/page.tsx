// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import { prisma } from "@/lib/prisma";
// import { Role } from "@prisma/client";
// import Link from "next/link";
// import LogoutButton from "@/components/LogoutButton";

// export default async function AdminDashboardPage() {
  
//   const session = await auth();
//   if (!session?.user?.id) {
//     redirect("/login");
//   }
//   if (session.user.role !== Role.ADMIN) {
//     redirect("/"); 
//   }

//   const semuaKantin = await prisma.kantin.findMany({
//     orderBy: {
//       nama_kantin: 'asc'
//     },
//     include: {
//       Penjual: {
//         include: {
//           Akun: {
//             select: { username: true }
//           }
//         }
//       }
//     }
//   });


//   return (
//     <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
//       <section className="mb-8 p-6 bg-white shadow-md rounded-lg">
//         <h1 className="text-3xl font-bold mb-2">
//           Dashboard Admin
//         </h1>
//         <p className="text-gray-600">Selamat datang, {session.user.name}.</p>
//         <LogoutButton/>
//       </section>
//       <section className="p-6 bg-white shadow-md rounded-lg">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold">Moderasi Kantin</h2>
//         </div>

//         {semuaKantin.length === 0 ? (
//           <p className="text-gray-500">Belum ada kantin yang terdaftar di sistem.</p>
//         ) : (
//           <ul className="space-y-4">
//             {semuaKantin.map((kantin) => (
//               <li
//                 key={kantin.id_kantin}
//                 className="flex justify-between items-center border border-gray-200 p-4 rounded-lg"
//               >
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-800">{kantin.nama_kantin}</h3>
//                   <small className="text-gray-500">Lokasi: {kantin.lokasi || "Belum diatur"}</small>
//                   <br />
//                   <small className="text-blue-600">
//                     Pemilik: {kantin.Penjual.nama_penjual} ({kantin.Penjual.Akun.username})
//                   </small>
//                 </div>
//                 <Link 
//                   href={`/admin/kantin/${kantin.id_kantin}`}
//                   className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 whitespace-nowrap"
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
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminDashboardPage() {
  
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  if (session.user.role !== Role.ADMIN) {
    redirect("/"); 
  }

  const semuaKantin = await prisma.kantin.findMany({
    orderBy: {
      nama_kantin: 'asc'
    },
    include: {
      Penjual: {
        include: {
          Akun: {
            select: { username: true }
          }
        }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Dashboard Admin
                  </h1>
                  <p className="text-blue-100 text-lg">
                    Selamat datang, <span className="font-semibold">{session.user.name}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <LogoutButton/>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
              <div className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Kantin</p>
                    <p className="text-2xl font-bold text-slate-900">{semuaKantin.length}</p>
                  </div>
                </div>
              </div>
              <div className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-green-50">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Status</p>
                    <p className="text-2xl font-bold text-slate-900">Aktif</p>
                  </div>
                </div>
              </div>
              <div className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-50">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Penjual</p>
                    <p className="text-2xl font-bold text-slate-900">{semuaKantin.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kantin Management Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Moderasi Kantin</h2>
                <p className="text-slate-600 mt-1">Kelola dan moderasi semua kantin terdaftar</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button>
                {/* <button className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Kantin
                </button> */}
              </div>
            </div>
          </div>

          <div className="p-8">
            {semuaKantin.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-4">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum Ada Kantin</h3>
                <p className="text-slate-600 mb-6">Belum ada kantin yang terdaftar di sistem.</p>
                <button className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-sm">
                  Daftarkan Kantin Pertama
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {semuaKantin.map((kantin) => (
                  <div
                    key={kantin.id_kantin}
                    className="group relative bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {kantin.nama_kantin}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="font-medium">{kantin.lokasi || "Belum diatur"}</span>
                            </div>
                            
                            <div className="h-4 w-px bg-slate-300"></div>
                            
                            <div className="flex items-center gap-1.5 text-sm">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="text-slate-900 font-semibold">{kantin.Penjual.nama_penjual}</span>
                              <span className="text-slate-500">(@{kantin.Penjual.Akun.username})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 sm:flex-shrink-0">
                        <Link 
                          href={`/admin/kantin/${kantin.id_kantin}`}
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

