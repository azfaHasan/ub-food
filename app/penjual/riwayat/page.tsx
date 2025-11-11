// import { auth } from "@/auth";
// import { prisma } from "@/lib/prisma";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { formatRupiah } from "@/lib/utils";
// import { Prisma, Role, StatusPemesanan } from "@prisma/client";

// function StatusBadge({ status }: { status: StatusPemesanan }) {
//   let colorClass = "bg-gray-700";
//   if (status === 'DIBATALKAN') {
//     colorClass = "bg-red-600";
//   }
//   return (
//     <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${colorClass}`}>
//       {status.replace('_', ' ')}
//     </span>
//   );
// }

// const pesananPenjualQueryArgs = {
//   include: {
//     Kantin: { select: { nama_kantin: true } },
//     User: { select: { nama_user: true } }
//   }
// };
// type PesananRiwayatPenjual = Prisma.PemesananGetPayload<typeof pesananPenjualQueryArgs>;

// function OrderCardPenjual({ pesanan }: { pesanan: PesananRiwayatPenjual }) {
//   return (
//     <Link 
//       href={`/penjual/riwayat/${pesanan.id_pemesanan}`} 
//       className="block p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
//     >
//       <div className="flex justify-between items-center mb-2">
//         <span className="text-sm font-semibold text-gray-800">
//           Pesanan #{pesanan.id_pemesanan.substring(0, 5)} (Kantin: {pesanan.Kantin.nama_kantin})
//         </span>
//         <StatusBadge status={pesanan.status_pemesanan} />
//       </div>
//       <p className="text-xs text-gray-500">
//         Pemesan: {pesanan.User.nama_user}
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

// export default async function PenjualRiwayatPage() {
//   const session = await auth();
//   // Keamanan: Pastikan penjual
//   if (session?.user?.role !== Role.PENJUAL || !session.user.akunId) {
//     redirect("/login/penjual");
//   }

//   const daftarPesanan = await prisma.pemesanan.findMany({
//     where: {
//       Kantin: {
//         Penjual: {
//           id_akun: session.user.akunId
//         }
//       },
//       status_pemesanan: {
//         in: [StatusPemesanan.SELESAI, StatusPemesanan.DIBATALKAN]
//       }
//     },
//     include: pesananPenjualQueryArgs.include,
//     orderBy: {
//       tanggal_pemesanan: 'desc'
//     }
//   });

//   return (
//     <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
//       <h1 className="text-3xl font-bold mb-6">Arsip Riwayat Pesanan</h1>
//       {daftarPesanan.length === 0 ? (
//         <p className="text-center text-gray-500">
//           Belum ada pesanan yang selesai atau dibatalkan.
//         </p>
//       ) : (
//         <div className="space-y-4">
//           {daftarPesanan.map((pesanan) => (
//             <OrderCardPenjual key={pesanan.id_pemesanan} pesanan={pesanan} />
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
import { Prisma, Role, StatusPemesanan } from "@prisma/client";

/**
 * StatusBadge yang didesain ulang (dari referensi pertama)
 * Ini akan menangani SELESAI dan DIBATALKAN dengan benar.
 */
function StatusBadge({ status }: { status: StatusPemesanan }) {
  let bgClass = "bg-slate-50";
  let textClass = "text-slate-700";
  let icon = null;

  switch (status) {
    case 'PENDING':
      bgClass = "bg-yellow-50";
      textClass = "text-yellow-700";
      icon = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      break;
    case 'DIPROSES':
      bgClass = "bg-blue-50";
      textClass = "text-blue-700";
      icon = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
      break;
    case 'SIAP_DIAMBIL':
      bgClass = "bg-green-50";
      textClass = "text-green-700";
      icon = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      break;
    case 'SELESAI':
      // Sesuai dengan status yang digunakan di halaman ini
      bgClass = "bg-slate-100";
      textClass = "text-slate-700";
      icon = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
      break;
    case 'DIBATALKAN':
      // Sesuai dengan status yang digunakan di halaman ini
      bgClass = "bg-red-50";
      textClass = "text-red-700";
      icon = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
      break;
  }

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold ${bgClass} ${textClass}`}>
      {icon}
      {status.replace('_', ' ')}
    </span>
  );
}

const pesananPenjualQueryArgs = {
  include: {
    Kantin: { select: { nama_kantin: true } },
    User: { select: { nama_user: true } }
  }
};
type PesananRiwayatPenjual = Prisma.PemesananGetPayload<typeof pesananPenjualQueryArgs>;

/**
 * OrderCardPenjual yang didesain ulang agar sesuai dengan UI
 */
function OrderCardPenjual({ pesanan }: { pesanan: PesananRiwayatPenjual }) {
  return (
    <Link 
      href={`/penjual/riwayat/${pesanan.id_pemesanan}`} 
      className="block p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 hover:border-slate-300 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Sisi Kiri: Ikon + Detail Teks */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow-sm">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 truncate" title={pesanan.Kantin.nama_kantin}>
              {pesanan.Kantin.nama_kantin}
            </p>
            <p className="text-sm text-slate-600">
              Pemesan: {pesanan.User.nama_user}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {new Date(pesanan.tanggal_pemesanan).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
        
        {/* Sisi Kanan: Harga + Status */}
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-slate-900">
            {formatRupiah(pesanan.total_harga)}
          </p>
          <div className="mt-1.5">
            <StatusBadge status={pesanan.status_pemesanan} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function PenjualRiwayatPage() {
  const session = await auth();
  // Keamanan: Pastikan penjual
  if (session?.user?.role !== Role.PENJUAL || !session.user.akunId) {
    redirect("/login/penjual");
  }

  const daftarPesanan = await prisma.pemesanan.findMany({
    where: {
      Kantin: {
        Penjual: {
          id_akun: session.user.akunId
        }
      },
      status_pemesanan: {
        in: [StatusPemesanan.SELESAI, StatusPemesanan.DIBATALKAN]
      }
    },
    include: pesananPenjualQueryArgs.include,
    orderBy: {
      tanggal_pemesanan: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Card */}
        <div className="mb-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                    {/* Ikon Arsip */}
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 01.707-.293H17" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Arsip Riwayat Pesanan
                  </h1>
                  <p className="text-sm text-purple-100">
                    Daftar pesanan yang telah selesai atau dibatalkan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Card (List) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Daftar Arsip</h2>
                <p className="text-sm text-slate-600">{daftarPesanan.length} pesanan ditemukan</p>
              </div>
            </div>
          </div>

          {/* Card Body (List or Empty State) */}
          <div className="p-4 sm:p-8">
            {daftarPesanan.length === 0 ? (
              // Empty State (Didesain ulang)
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 01.707-.293H17" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium text-center">
                  Belum ada pesanan di arsip.
                </p>
                <p className="text-sm text-slate-500 text-center">
                  Pesanan yang selesai atau dibatalkan akan muncul di sini.
                </p>
              </div>
            ) : (
              // List
              <div className="space-y-4">
                {daftarPesanan.map((pesanan) => (
                  <OrderCardPenjual key={pesanan.id_pemesanan} pesanan={pesanan} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}