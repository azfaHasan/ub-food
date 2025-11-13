// import { prisma } from "@/lib/prisma";
// import { auth } from "@/auth";
// import { Role, StatusPemesanan } from "@prisma/client";
// import { redirect } from "next/navigation";
// import { formatRupiah } from "@/lib/utils";
// import TombolAksiPenjual from "./TombolAksiPenjual"; 

// export const dynamic = 'force-dynamic';

// export default async function HalamanOrderPenjual({ params }: { params: Promise<{ id_kantin: string }>}) {
//   const session = await auth();
  
//   if (session?.user?.role !== Role.PENJUAL || !session.user.akunId) {
//     redirect('/login/penjual');
//   }
  
//   const paramsNew = await params;

//   const kantin = await prisma.kantin.findFirst({
//     where: { 
//       id_kantin: paramsNew.id_kantin,
//       Penjual: { 
//         id_akun: session.user.akunId 
//       }
//     },
//     select: { nama_kantin: true }
//   });

//   if (!kantin) {
//     redirect('/penjual');
//   }

//   const pesananAktif = await prisma.pemesanan.findMany({
//     where: {
//       id_kantin: paramsNew.id_kantin,
//       status_pemesanan: {
//         in: [
//           StatusPemesanan.PENDING, 
//           StatusPemesanan.DIPROSES,
//           StatusPemesanan.SIAP_DIAMBIL
//         ]
//       }
//     },
//     include: { 
//       User: { select: { nama_user: true } }, 
//       DetailPemesanan: { 
//         include: { Menu: { select: { nama_menu: true } } }
//       } 
//     },
//     orderBy: { tanggal_pemesanan: 'asc' }
//   });

//   return (
//     <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
//       <h1 className="text-3xl font-bold mb-1">Pesanan Aktif</h1>
//       <h2 className="text-xl text-gray-600 mb-6">{kantin.nama_kantin}</h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {pesananAktif.length === 0 && (
//           <p className="col-span-full text-center text-gray-500">
//             Tidak ada pesanan aktif saat ini.
//           </p>
//         )}
//         {pesananAktif.map(pesanan => (
//           <div key={pesanan.id_pemesanan} className="bg-white p-4 border rounded-lg shadow-sm flex flex-col justify-between">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="text-lg font-semibold">
//                   Pesanan #{pesanan.id_pemesanan.substring(0, 5)}
//                 </h3>
//                 <span 
//                   className={`px-2 py-0.5 rounded text-xs text-white ${
//                     pesanan.status_pemesanan === 'PENDING' ? 'bg-yellow-500' :
//                     pesanan.status_pemesanan === 'DIPROSES' ? 'bg-blue-500' : 'bg-green-500'
//                   }`}
//                 >
//                   {pesanan.status_pemesanan.replace('_', ' ')}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600">
//                 Pemesan: {pesanan.User.nama_user}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Total: {formatRupiah(pesanan.total_harga)}
//               </p>
              
//               <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
//                 {pesanan.DetailPemesanan.map(item => (
//                   <li key={item.id_detail}>
//                     {item.jumlah_menu}x {item.Menu.nama_menu}
//                   </li>
//                 ))}
//               </ul>
              
//               {pesanan.deskripsi_pemesanan && (
//                 <div className="mt-2 p-2 bg-gray-50 rounded border">
//                   <p className="text-xs font-semibold">Catatan:</p>
//                   <p className="text-xs">{pesanan.deskripsi_pemesanan}</p>
//                 </div>
//               )}
//             </div>
//             <TombolAksiPenjual pesanan={pesanan} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Role, StatusPemesanan } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import OrderManager from "./OrderManager"; // Komponen Client Baru

export const dynamic = 'force-dynamic';

// Tipe ini akan digunakan di komponen client
export type PesananAktifWithDetails = Awaited<ReturnType<typeof getPesananAktif>>[0];

async function getPesananAktif(id_kantin: string) {
  return await prisma.pemesanan.findMany({
    where: {
      id_kantin: id_kantin,
      status_pemesanan: {
        in: [
          StatusPemesanan.PENDING, 
          StatusPemesanan.DIPROSES,
          StatusPemesanan.SIAP_DIAMBIL
        ]
      }
    },
    include: { 
      User: { select: { nama_user: true } }, 
      DetailPemesanan: { 
        include: { Menu: { select: { nama_menu: true } } }
      } 
    },
    orderBy: { tanggal_pemesanan: 'asc' }
  });
}

export default async function HalamanOrderPenjual({ params }: { params: Promise<{ id_kantin: string }>}) {
  const session = await auth();
  
  if (session?.user?.role !== Role.PENJUAL || !session.user.akunId) {
    redirect('/login/penjual');
  }
  
  const paramsNew = await params;

  const kantin = await prisma.kantin.findFirst({
    where: { 
      id_kantin: paramsNew.id_kantin,
      Penjual: { 
        id_akun: session.user.akunId 
      }
    },
    select: { nama_kantin: true }
  });

  if (!kantin) {
    redirect('/penjual');
  }

  const pesananAktif = await getPesananAktif(paramsNew.id_kantin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/penjual" className="text-slate-600 hover:text-purple-600 transition-colors font-medium">
              Dashboard
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/penjual/kantin/${paramsNew.id_kantin}`} className="text-slate-600 hover:text-purple-600 transition-colors font-medium">
              Detail Kantin
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 font-semibold">Pesanan Aktif</span>
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
                    Pesanan Aktif
                  </h1>
                  <p className="text-sm text-purple-100">
                    Kelola semua pesanan masuk untuk: <strong>{kantin.nama_kantin}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Komponen Client untuk mengelola UI interaktif */}
        <OrderManager initialPesanan={pesananAktif} />
        
      </div>
    </div>
  );
}