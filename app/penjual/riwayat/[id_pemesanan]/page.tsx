// import { auth } from "@/auth";
// import { prisma } from "@/lib/prisma";
// import { formatRupiah } from "@/lib/utils";
// import { redirect, notFound } from "next/navigation";
// import { StatusPemesanan, StatusPembayaran, Role } from "@prisma/client";

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
//     <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium text-white ${colorClass}`}>
//       {status.replace('_', ' ')}
//     </span>
//   );
// }

// function StatusBayarBadge({ status }: { status: StatusPembayaran }) {
//   const isLunas = status === 'LUNAS';
//   const colorClass = isLunas ? 'bg-green-500' : 'bg-yellow-500';
  
//   return (
//     <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium text-white ${colorClass}`}>
//       {status}
//     </span>
//   );
// }

// export default async function DetailRiwayatPenjualPage({
//   params,
// }: {
//   params: Promise<{ id_pemesanan: string }>;
// }) {
//   const session = await auth();
  
//   if (!session?.user?.akunId || session.user.role !== Role.PENJUAL) {
//     redirect("/login/penjual");
//   }

//   const resolvedParams = await params;
//   const pemesanan = await prisma.pemesanan.findFirst({
//     where: {
//       id_pemesanan: resolvedParams.id_pemesanan,
//       Kantin: {
//         Penjual: {
//           id_akun: session.user.akunId
//         }
//       }
//     },
//     include: {
//       Kantin: {
//         select: { nama_kantin: true },
//       },
//       User: {
//         select: { nama_user: true }
//       },
//       DetailPemesanan: {
//         include: {
//           Menu: {
//             select: { nama_menu: true },
//           },
//         },
//       },
//     },
//   });

//   if (!pemesanan) {
//     notFound(); 
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//         <div className="p-6 border-b">
//           <h1 className="text-2xl font-bold">Detail Pesanan (Penjual)</h1>
//           <p className="text-sm text-gray-500">ID Pesanan: {pemesanan.id_pemesanan}</p>
//           <p className="text-sm text-gray-500">
//             Tanggal: {new Date(pemesanan.tanggal_pemesanan).toLocaleString("id-ID")}
//           </p>
//         </div>
//         <div className="p-6 grid grid-cols-2 gap-4 border-b">
//           <div>
//             <h4 className="text-sm font-semibold text-gray-500 uppercase">Kantin</h4>
//             <p className="text-lg font-medium">{pemesanan.Kantin.nama_kantin}</p>
//           </div>
//           {/* Tampilkan nama pemesan */}
//           <div>
//             <h4 className="text-sm font-semibold text-gray-500 uppercase">Pemesan</h4>
//             <p className="text-lg font-medium">{pemesanan.User.nama_user}</p>
//           </div>
//           <div>
//             <h4 className="text-sm font-semibold text-gray-500 uppercase">Status Pesanan</h4>
//             <StatusBadge status={pemesanan.status_pemesanan} />
//           </div>
//           <div>
//             <h4 className="text-sm font-semibold text-gray-500 uppercase">Metode Bayar</h4>
//             <p className="text-lg font-medium">{pemesanan.metode_pembayaran}</p>
//           </div>
//           <div>
//             <h4 className="text-sm font-semibold text-gray-500 uppercase">Status Bayar</h4>
//             <StatusBayarBadge status={pemesanan.status_pembayaran} />
//           </div>
//         </div>
//         <div className="p-6">
//           <h3 className="text-lg font-semibold mb-4">Rincian Menu</h3>
//           <ul className="space-y-3">
//             {pemesanan.DetailPemesanan.map((item) => (
//               <li key={item.id_detail} className="flex justify-between items-center">
//                 <div>
//                   <p className="font-medium">
//                     {item.Menu.nama_menu}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {item.jumlah_menu} x {formatRupiah(item.harga_satuan)}
//                   </p>
//                 </div>
//                 <p className="font-medium">
//                   {formatRupiah(item.jumlah_menu * item.harga_satuan)}
//                 </p>
//               </li>
//             ))}
//           </ul>
//           <hr className="my-4" />
//           <div className="flex justify-between items-center">
//             <h3 className="text-xl font-bold">Total Harga</h3>
//             <p className="text-xl font-bold text-blue-600">
//               {formatRupiah(pemesanan.total_harga)}
//             </p>
//           </div>
//           {pemesanan.deskripsi_pemesanan && (
//             <div className="mt-4 bg-gray-50 p-3 rounded-md">
//               <h4 className="font-semibold">Catatan dari Pemesan:</h4>
//               <p className="text-sm text-gray-700">{pemesanan.deskripsi_pemesanan}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { redirect, notFound } from "next/navigation";
import { StatusPemesanan, StatusPembayaran, Role } from "@prisma/client";
import Link from "next/link"; // Ditambahkan untuk navigasi

// === KOMPONEN BADGE DIMULAI ===
// Diambil dari referensi UI pertama Anda untuk konsistensi

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
      bgClass = "bg-slate-100";
      textClass = "text-slate-700";
      icon = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
      break;
    case 'DIBATALKAN':
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
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${bgClass} ${textClass}`}>
      {icon}
      {status.replace('_', ' ')}
    </span>
  );
}

function StatusBayarBadge({ status }: { status: StatusPembayaran }) {
  const isLunas = status === 'LUNAS';
  const bgClass = isLunas ? 'bg-green-50' : 'bg-yellow-50';
  const textClass = isLunas ? 'text-green-700' : 'text-yellow-700';
  const icon = isLunas ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${bgClass} ${textClass}`}>
      {icon}
      {status}
    </span>
  );
}

// === KOMPONEN BADGE BERAKHIR ===


export default async function DetailRiwayatPenjualPage({
  params,
}: {
  params: Promise<{ id_pemesanan: string }>;
}) {
  const session = await auth();
  
  if (!session?.user?.akunId || session.user.role !== Role.PENJUAL) {
    redirect("/login/penjual");
  }

  const resolvedParams = await params;
  const pemesanan = await prisma.pemesanan.findFirst({
    where: {
      id_pemesanan: resolvedParams.id_pemesanan,
      Kantin: {
        Penjual: {
          id_akun: session.user.akunId
        }
      }
    },
    include: {
      Kantin: {
        select: { nama_kantin: true },
      },
      User: {
        select: { nama_user: true }
      },
      DetailPemesanan: {
        include: {
          Menu: {
            select: { nama_menu: true },
          },
        },
      },
    },
  });

  if (!pemesanan) {
    notFound(); 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/penjual/riwayat" className="text-slate-600 hover:text-slate-600 transition-colors font-medium">
              Arsip Riwayat
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 font-semibold">Detail Pesanan</span>
          </nav>
        </div>

        {/* Header Card */}
        <div className="mb-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Detail Pesanan
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-purple-100">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {pemesanan.id_pemesanan.slice(0, 12)}...
                    </span>
                    <span className="text-purple-200">•</span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(pemesanan.tanggal_pemesanan).toLocaleDateString("id-ID", {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-purple-200">•</span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(pemesanan.tanggal_pemesanan).toLocaleTimeString("id-ID", {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Info Grid */}
        <div className="mb-6 grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 flex-shrink-0">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-500 mb-1">Pemesan</p>
                <p className="text-lg font-bold text-slate-900">{pemesanan.User.nama_user}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-500 mb-2">Status Pesanan</p>
                <StatusBadge status={pemesanan.status_pemesanan} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-500 mb-1">Metode Pembayaran</p>
                <p className="text-lg font-bold text-slate-900">{pemesanan.metode_pembayaran}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-500 mb-2">Status Pembayaran</p>
                <StatusBayarBadge status={pemesanan.status_pembayaran} />
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Rincian Menu</h2>
                <p className="text-sm text-slate-600">{pemesanan.DetailPemesanan.length} item pesanan</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-4">
              {pemesanan.DetailPemesanan.map((item) => (
                <div key={item.id_detail} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-sm flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 mb-1">
                        {item.Menu.nama_menu}
                      </p>
                      <p className="text-sm text-slate-600">
                        {item.jumlah_menu} × {formatRupiah(item.harga_satuan)}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {formatRupiah(item.jumlah_menu * item.harga_satuan)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t-2 border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Total Pembayaran</h3>
                <p className="text-3xl font-bold text-emerald-600">
                  {formatRupiah(pemesanan.total_harga)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {pemesanan.deskripsi_pemesanan && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm">
                  <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Catatan dari Pemesan</h2>
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="text-slate-700 leading-relaxed">{pemesanan.deskripsi_pemesanan}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex">
          <Link
            href="/penjual/riwayat"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Kembali ke Arsip</span>
          </Link>
        </div>
      </div>
    </div>
  );
}