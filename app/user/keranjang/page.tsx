// import { auth } from "@/auth";
// import { prisma } from "@/lib/prisma";
// import { formatRupiah } from "@/lib/utils";
// import { redirect } from "next/navigation";
// import HapusItemButton from "@/components/HapusItemButton";
// import FinalisasiForm from "./FinalisasiForm";

// export default async function KeranjangPage() {
//   const session = await auth();
//   if (!session?.user?.id) {
//     redirect("/login");
//   }

//   const keranjang = await prisma.keranjang.findUnique({
//     where: { id_user: session.user.id },
//     include: {
//       DetailKeranjang: {
//         include: {
//           Menu: {
//             include: {
//               Kantin: {
//                 select: { nama_kantin: true }
//               }
//             }
//           }
//         },
//         orderBy: {
//           Menu: { nama_menu: 'asc' }
//         }
//       }
//     }
//   });

//   const items = keranjang?.DetailKeranjang || [];  
//   const kantinNama = items.length > 0 ? items[0].Menu.Kantin.nama_kantin : null;
//   const totalHarga = items.reduce((total, item) => {
//     return total + (item.jumlah * item.Menu.harga_menu);
//   }, 0);

//   if (items.length === 0) {
//     return (
//       <div className="max-w-xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
//         <h1 className="text-3xl font-bold mb-4">Keranjang Anda</h1>
//         <div className="bg-white shadow-lg rounded-lg p-8">
//           <p className="text-gray-500">Keranjang Anda masih kosong.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-xl mx-auto p-4 sm:p-6 lg:p-8">
//       <h1 className="text-3xl font-bold mb-2">Keranjang Anda</h1>
//       {kantinNama && (
//         <h2 className="text-xl font-semibold text-gray-700 mb-6">
//           Pesanan dari: {kantinNama}
//         </h2>
//       )}

//       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//         <div className="p-6">
//           <h3 className="text-lg font-semibold mb-4">Item Pesanan</h3>
//           <ul className="space-y-4">
//             {items.map((item) => (
//               <li key={item.id_detail_keranjang} className="flex justify-between items-start">
//                 <div>
//                   <p className="font-medium">{item.Menu.nama_menu}</p>
//                   <p className="text-sm text-gray-500">
//                     {item.jumlah} x {formatRupiah(item.Menu.harga_menu)}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-medium">
//                     {formatRupiah(item.jumlah * item.Menu.harga_menu)}
//                   </p>
//                   <HapusItemButton id_detail_keranjang={item.id_detail_keranjang} />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="p-6 border-t border-b bg-gray-50">
//           <div className="flex justify-between items-center">
//             <h3 className="text-xl font-bold">Total Harga</h3>
//             <p className="text-xl font-bold text-blue-600">
//               {formatRupiah(totalHarga)}
//             </p>
//           </div>
//         </div>
//         <FinalisasiForm />
//       </div>
//     </div>
//   );
// }


import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { redirect } from "next/navigation";
import HapusItemButton from "@/components/HapusItemButton";
import FinalisasiForm from "./FinalisasiForm";
import Link from "next/link"; // Ditambahkan untuk tombol di keranjang kosong

export default async function KeranjangPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const keranjang = await prisma.keranjang.findUnique({
    where: { id_user: session.user.id },
    include: {
      DetailKeranjang: {
        include: {
          Menu: {
            include: {
              Kantin: {
                select: { nama_kantin: true }
              }
            }
          }
        },
        orderBy: {
          Menu: { nama_menu: 'asc' }
        }
      }
    }
  });

  const items = keranjang?.DetailKeranjang || [];
  const kantinNama = items.length > 0 ? items[0].Menu.Kantin.nama_kantin : null;
  const totalHarga = items.reduce((total, item) => {
    return total + (item.jumlah * item.Menu.harga_menu);
  }, 0);

  // === Tampilan Keranjang Kosong (Didesain Ulang) ===
  if (items.length === 0) {
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
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Keranjang Anda
                    </h1>
                    <p className="text-sm text-purple-100">
                      Keranjang Anda masih kosong.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium text-center mb-1">
                  Anda belum menambahkan item
                </p>
                <p className="text-sm text-slate-500 text-center mb-6">
                  Silakan jelajahi kantin dan tambahkan menu ke keranjang.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Mulai Belanja</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === Tampilan Keranjang dengan Item ===
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
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Keranjang Anda
                  </h1>
                  {kantinNama && (
                    <p className="text-sm text-purple-100">
                      Pesanan dari: <strong>{kantinNama}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card (Items, Total, Form) */}
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
                <h2 className="text-xl font-bold text-slate-900">Item Pesanan</h2>
                <p className="text-sm text-slate-600">{items.length} item di keranjang</p>
              </div>
            </div>
          </div>

          {/* Item List */}
          <div className="p-4 sm:p-8">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id_detail_keranjang} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
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
                        {item.jumlah} × {formatRupiah(item.Menu.harga_menu)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-lg font-bold text-slate-900">
                      {formatRupiah(item.jumlah * item.Menu.harga_menu)}
                    </p>
                    <div className="mt-1">
                      <HapusItemButton id_detail_keranjang={item.id_detail_keranjang} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Section */}
          <div className="px-8 py-6 border-t-2 border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Total Pembayaran</h3>
              <p className="text-3xl font-bold text-emerald-600">
                {formatRupiah(totalHarga)}
              </p>
            </div>
          </div>

          {/* Checkout Form Section */}
          <div className="border-t border-slate-200 bg-slate-50">
            <div className="p-4 sm:p-8">
              <FinalisasiForm />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}