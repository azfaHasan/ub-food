import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { redirect, notFound } from "next/navigation";

function StatusBadge({ status }: { status: string }) {
  let colorClass = "bg-gray-500";
  switch (status) {
    case 'PENDING': colorClass = "bg-yellow-500"; break;
    case 'DIPROSES': colorClass = "bg-blue-500"; break;
    case 'SIAP_DIAMBIL': colorClass = "bg-green-500"; break;
    case 'SELESAI': colorClass = "bg-gray-700"; break;
    case 'DIBATALKAN': colorClass = "bg-red-600"; break;
  }
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium text-white ${colorClass}`}>
      {status}
    </span>
  );
}

function StatusBayarBadge({ status }: { status: string }) {
  const isLunas = status === 'LUNAS';
  const colorClass = isLunas ? 'bg-green-500' : 'bg-yellow-500';
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium text-white ${colorClass}`}>
      {status}
    </span>
  );
}

export default async function DetailPesananPage({
  params,
}: {
  params: { id_pemesanan: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const pemesanan = await prisma.pemesanan.findFirst({
    where: {
      id_pemesanan: params.id_pemesanan,
      id_user: session.user.id,
    },
    include: {
      Kantin: {
        select: { nama_kantin: true },
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
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Detail Pesanan</h1>
          <p className="text-sm text-gray-500">ID Pesanan: {pemesanan.id_pemesanan}</p>
          <p className="text-sm text-gray-500">
            Tanggal: {new Date(pemesanan.tanggal_pemesanan).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4 border-b">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase">Kantin</h4>
            <p className="text-lg font-medium">{pemesanan.Kantin.nama_kantin}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase">Status Pesanan</h4>
            <StatusBadge status={pemesanan.status_pemesanan} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase">Metode Bayar</h4>
            <p className="text-lg font-medium">{pemesanan.metode_pembayaran}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase">Status Bayar</h4>
            <StatusBayarBadge status={pemesanan.status_pembayaran} />
          </div>
        </div>        
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Rincian Menu</h3>
          <ul className="space-y-3">
            {pemesanan.DetailPemesanan.map((item) => (
              <li key={item.id_detail} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {item.Menu.nama_menu}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.jumlah_menu} x {formatRupiah(item.harga_satuan)}
                  </p>
                </div>
                <p className="font-medium">
                  {formatRupiah(item.jumlah_menu * item.harga_satuan)}
                </p>
              </li>
            ))}
          </ul>
          <hr className="my-4" />
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Total Harga</h3>
            <p className="text-xl font-bold text-blue-600">
              {formatRupiah(pemesanan.total_harga)}
            </p>
          </div>
          {pemesanan.deskripsi_pemesanan && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <h4 className="font-semibold">Catatan:</h4>
              <p className="text-sm text-gray-700">{pemesanan.deskripsi_pemesanan}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}