// import { auth } from "@/auth";
// import { prisma } from "@/lib/prisma";
// import { redirect } from "next/navigation";
// import NotifikasiItem from "@/components/NotifikasiItem";
// import TandaiSemuaDibacaButton from "@/components/TandaiSemuaDibacaButton";
// import { Role } from "@prisma/client";

// export const dynamic = 'force-dynamic';

// export default async function NotifikasiPage() {
//   const session = await auth();

//   if (!session?.user?.akunId || session.user.role !== Role.PENJUAL) {
//     redirect("/login/penjual");
//   }

//   const daftarNotifikasi = await prisma.notifikasi.findMany({
//     where: {
//       id_akun_tujuan: session.user.akunId,
//     },
//     orderBy: {
//       waktu_kirim: 'desc',
//     },
//   });

//   const adaYangBelumDibaca = daftarNotifikasi.some(n => !n.status_baca);

//   return (
//     <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Notifikasi Penjual</h1>
//         {adaYangBelumDibaca && (
//           <TandaiSemuaDibacaButton />
//         )}
//       </div>

//       <div className="bg-white shadow-md rounded-lg">
//         {daftarNotifikasi.length === 0 ? (
//           <p className="text-gray-500 p-6 text-center">
//             Belum memiliki notifikasi dari kantin anda.
//           </p>
//         ) : (
//           <ul className="divide-y divide-gray-200">
//             {daftarNotifikasi.map((notif) => (
//               <NotifikasiItem key={notif.id_notifikasi} notif={notif} />
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }


import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NotifikasiItem from "@/components/NotifikasiItem";
import TandaiSemuaDibacaButton from "@/components/TandaiSemuaDibacaButton";
import { Role } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function NotifikasiPage() {
  const session = await auth();

  if (!session?.user?.akunId || session.user.role !== Role.PENJUAL) {
    redirect("/login/penjual");
  }

  const daftarNotifikasi = await prisma.notifikasi.findMany({
    where: {
      id_akun_tujuan: session.user.akunId,
    },
    orderBy: {
      waktu_kirim: 'desc',
    },
  });

  const adaYangBelumDibaca = daftarNotifikasi.some(n => !n.status_baca);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Card */}
        <div className="mb-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                    {/* Ikon Lonceng untuk Notifikasi */}
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Notifikasi Penjual
                  </h1>
                  <p className="text-sm text-purple-100">
                    {daftarNotifikasi.length > 0
                      ? "Pembaruan pesanan dan info penting untuk kantin Anda."
                      : "Belum ada notifikasi untuk ditampilkan."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification List Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm flex-shrink-0">
                  <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 0l9 5 9-5" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Daftar Notifikasi</h2>
                  <p className="text-sm text-slate-600">{daftarNotifikasi.length} item</p>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                {adaYangBelumDibaca && (
                  <TandaiSemuaDibacaButton />
                )}
              </div>
            </div>
          </div>

          {/* Card Content (The List or Empty State) */}
          <div className="p-4 sm:p-8">
            {daftarNotifikasi.length === 0 ? (
              // Empty State (Didesain ulang)
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </div>
                <p className="text-slate-600 font-medium text-center">
                  Belum ada notifikasi.
                </p>
                <p className="text-sm text-slate-500 text-center">
                  Notifikasi baru dari kantin Anda akan muncul di sini.
                </p>
              </div>
            ) : (
              // List
              <div className="space-y-3">
                {daftarNotifikasi.map((notif) => (
                  <NotifikasiItem key={notif.id_notifikasi} notif={notif} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}