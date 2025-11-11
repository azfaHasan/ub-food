// import { auth } from "@/auth";
// import { prisma } from "@/lib/prisma";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { formatRupiah } from "@/lib/utils";
// import { Prisma, StatusPemesanan } from "@prisma/client";

// function StatusBadge({ status }: { status: StatusPemesanan }) {
//   let colorClass = "bg-gray-500";
//   switch (status) {
//     case 'PENDING': colorClass = "bg-yellow-500"; break;
//     case 'DIPROSES': colorClass = "bg-blue-500"; break;
//     case 'SIAP_DIAMBIL': colorClass = "bg-green-500"; break;
//     case 'SELESAI': colorClass = "bg-gray-700"; break;
//     case 'DIBATALKAN': colorClass = "bg-red-600"; break;
//   }
//   return (
//     <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${colorClass}`}>
//       {status.replace('_', ' ')}
//     </span>
//   );
// }

// const pesananCardQueryArgs = {
//   include: {
//     Kantin: {
//       select: { nama_kantin: true }
//     }
//   }
// };

// type PesananWithKantin = Prisma.PemesananGetPayload<typeof pesananCardQueryArgs>;

// function OrderCard({ pesanan }: { pesanan: PesananWithKantin }) {
//   return (
//     <Link 
//       href={`/user/riwayat/${pesanan.id_pemesanan}`}
//       className="block p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
//     >
//       <div className="flex justify-between items-center mb-2">
//         <span className="text-sm font-semibold text-gray-800">
//           Pesanan di {pesanan.Kantin.nama_kantin}
//         </span>
//         <StatusBadge status={pesanan.status_pemesanan} />
//       </div>
//       <p className="text-xs text-gray-500">
//         ID: {pesanan.id_pemesanan}
//       </p>
//       <p className="text-xs text-gray-500">
//         {new Date(pesanan.tanggal_pemesanan).toLocaleString("id-ID")}
//       </p>
//       <p className="text-lg font-bold text-right mt-2">
//         {formatRupiah(pesanan.total_harga)}
//       </p>
//     </Link>
//   );
// }

// export default async function RiwayatPesananPage() {
//   const session = await auth();
//   if (!session?.user?.id) {
//     redirect("/login");
//   }

//   const daftarPesanan = await prisma.pemesanan.findMany({
//     where: {
//       id_user: session.user.id,
//     },
//     include: {
//       Kantin: {
//         select: { nama_kantin: true }
//       }
//     },
//     orderBy: {
//       tanggal_pemesanan: 'desc'
//     }
//   });

//   return (
//     <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
//       <h1 className="text-3xl font-bold mb-6">Riwayat Pesanan</h1>
//       {daftarPesanan.length === 0 ? (
//         <p className="text-center text-gray-500">
//           Anda belum memiliki riwayat pesanan.
//         </p>
//       ) : (
//         <div className="space-y-4">
//           {daftarPesanan.map((pesanan) => (
//             <OrderCard key={pesanan.id_pemesanan} pesanan={pesanan} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { Prisma, StatusPemesanan } from "@prisma/client";

function StatusBadge({ status }: { status: StatusPemesanan }) {
  let colorClass = "bg-slate-500";
  let bgClass = "bg-slate-50";
  let textClass = "text-slate-700";
  let icon = null;
  
  switch (status) {
    case 'PENDING':
      colorClass = "bg-yellow-500";
      bgClass = "bg-yellow-50";
      textClass = "text-yellow-700";
      icon = (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      break;
    case 'DIPROSES':
      colorClass = "bg-blue-500";
      bgClass = "bg-blue-50";
      textClass = "text-blue-700";
      icon = (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
      break;
    case 'SIAP_DIAMBIL':
      colorClass = "bg-green-500";
      bgClass = "bg-green-50";
      textClass = "text-green-700";
      icon = (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      break;
    case 'SELESAI':
      colorClass = "bg-slate-700";
      bgClass = "bg-slate-50";
      textClass = "text-slate-700";
      icon = (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
      break;
    case 'DIBATALKAN':
      colorClass = "bg-red-600";
      bgClass = "bg-red-50";
      textClass = "text-red-700";
      icon = (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
      break;
  }
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${bgClass} ${textClass}`}>
      {icon}
      {status.replace('_', ' ')}
    </span>
  );
}

const pesananCardQueryArgs = {
  include: {
    Kantin: {
      select: { nama_kantin: true }
    }
  }
};

type PesananWithKantin = Prisma.PemesananGetPayload<typeof pesananCardQueryArgs>;

function OrderCard({ pesanan }: { pesanan: PesananWithKantin }) {
  return (
    <Link 
      href={`/user/riwayat/${pesanan.id_pemesanan}`}
      className="group block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-500 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                {pesanan.Kantin.nama_kantin}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {pesanan.id_pemesanan.slice(0, 8)}...
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(pesanan.tanggal_pemesanan).toLocaleDateString("id-ID", {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(pesanan.tanggal_pemesanan).toLocaleTimeString("id-ID", {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
          
          <StatusBadge status={pesanan.status_pemesanan} />
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-sm font-medium text-slate-600">Total Pembayaran</span>
          <span className="text-2xl font-bold text-emerald-600">
            {formatRupiah(pesanan.total_harga)}
          </span>
        </div>
      </div>
      
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-600">Lihat detail pesanan</span>
        <svg className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default async function RiwayatPesananPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const daftarPesanan = await prisma.pemesanan.findMany({
    where: {
      id_user: session.user.id,
    },
    include: {
      Kantin: {
        select: { nama_kantin: true }
      }
    },
    orderBy: {
      tanggal_pemesanan: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-1">
                    Riwayat Pesanan
                  </h1>
                  <p className="text-purple-100">
                    {daftarPesanan.length} pesanan ditemukan
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200">
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {daftarPesanan.filter(p => p.status_pemesanan === 'PENDING').length}
                </div>
                <div className="text-xs text-slate-600 font-medium">Pending</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {daftarPesanan.filter(p => p.status_pemesanan === 'DIPROSES').length}
                </div>
                <div className="text-xs text-slate-600 font-medium">Diproses</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {daftarPesanan.filter(p => p.status_pemesanan === 'SIAP_DIAMBIL').length}
                </div>
                <div className="text-xs text-slate-600 font-medium">Siap</div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {daftarPesanan.filter(p => p.status_pemesanan === 'SELESAI').length}
                </div>
                <div className="text-xs text-slate-600 font-medium">Selesai</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-700">Filter:</span>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors">
            Semua
          </button>
          {/* <button className="px-4 py-2 bg-white text-slate-700 rounded-xl text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">
            Pending
          </button>
          <button className="px-4 py-2 bg-white text-slate-700 rounded-xl text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">
            Diproses
          </button>
          <button className="px-4 py-2 bg-white text-slate-700 rounded-xl text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">
            Selesai
          </button> */}
        </div>

        {/* Orders List */}
        {daftarPesanan.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="text-center py-16 px-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-50 mb-4">
                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum Ada Pesanan</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Anda belum memiliki riwayat pesanan. Mulai pesan makanan favorit Anda sekarang!
              </p>
              <Link 
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Jelajahi Menu</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {daftarPesanan.map((pesanan) => (
              <OrderCard key={pesanan.id_pemesanan} pesanan={pesanan} />
            ))}
          </div>
        )}

        {/* Summary Card - Only show if there are orders */}
        {daftarPesanan.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-blue-500 to-blue-500 rounded-3xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Total Pengeluaran</h3>
                <p className="text-blue-100 text-sm">Dari semua pesanan Anda</p>
              </div>
            </div>
            <p className="text-3xl font-bold">
              {formatRupiah(daftarPesanan.reduce((sum, p) => sum + p.total_harga, 0))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}