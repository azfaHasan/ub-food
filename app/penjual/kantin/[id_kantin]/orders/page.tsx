import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Role, StatusPemesanan } from "@prisma/client";
import { redirect } from "next/navigation";
import { formatRupiah } from "@/lib/utils";
import TombolAksiPenjual from "./TombolAksiPenjual"; 

export const dynamic = 'force-dynamic';

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

  const pesananAktif = await prisma.pemesanan.findMany({
    where: {
      id_kantin: paramsNew.id_kantin,
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

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-1">Pesanan Aktif</h1>
      <h2 className="text-xl text-gray-600 mb-6">{kantin.nama_kantin}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pesananAktif.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            Tidak ada pesanan aktif saat ini.
          </p>
        )}
        {pesananAktif.map(pesanan => (
          <div key={pesanan.id_pemesanan} className="bg-white p-4 border rounded-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  Pesanan #{pesanan.id_pemesanan.substring(0, 5)}
                </h3>
                <span 
                  className={`px-2 py-0.5 rounded text-xs text-white ${
                    pesanan.status_pemesanan === 'PENDING' ? 'bg-yellow-500' :
                    pesanan.status_pemesanan === 'DIPROSES' ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                >
                  {pesanan.status_pemesanan.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Pemesan: {pesanan.User.nama_user}
              </p>
              <p className="text-sm text-gray-600">
                Total: {formatRupiah(pesanan.total_harga)}
              </p>
              
              <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                {pesanan.DetailPemesanan.map(item => (
                  <li key={item.id_detail}>
                    {item.jumlah_menu}x {item.Menu.nama_menu}
                  </li>
                ))}
              </ul>
              
              {pesanan.deskripsi_pemesanan && (
                <div className="mt-2 p-2 bg-gray-50 rounded border">
                  <p className="text-xs font-semibold">Catatan:</p>
                  <p className="text-xs">{pesanan.deskripsi_pemesanan}</p>
                </div>
              )}
            </div>
            <TombolAksiPenjual pesanan={pesanan} />
          </div>
        ))}
      </div>
    </div>
  );
}