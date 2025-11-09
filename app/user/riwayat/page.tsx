import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { Prisma, StatusPemesanan } from "@prisma/client";

function StatusBadge({ status }: { status: StatusPemesanan }) {
  let colorClass = "bg-gray-500";
  switch (status) {
    case 'PENDING': colorClass = "bg-yellow-500"; break;
    case 'DIPROSES': colorClass = "bg-blue-500"; break;
    case 'SIAP_DIAMBIL': colorClass = "bg-green-500"; break;
    case 'SELESAI': colorClass = "bg-gray-700"; break;
    case 'DIBATALKAN': colorClass = "bg-red-600"; break;
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${colorClass}`}>
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
      className="block p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-800">
          Pesanan di {pesanan.Kantin.nama_kantin}
        </span>
        <StatusBadge status={pesanan.status_pemesanan} />
      </div>
      <p className="text-xs text-gray-500">
        ID: {pesanan.id_pemesanan}
      </p>
      <p className="text-xs text-gray-500">
        {new Date(pesanan.tanggal_pemesanan).toLocaleString("id-ID")}
      </p>
      <p className="text-lg font-bold text-right mt-2">
        {formatRupiah(pesanan.total_harga)}
      </p>
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Riwayat Pesanan</h1>
      {daftarPesanan.length === 0 ? (
        <p className="text-center text-gray-500">
          Anda belum memiliki riwayat pesanan.
        </p>
      ) : (
        <div className="space-y-4">
          {daftarPesanan.map((pesanan) => (
            <OrderCard key={pesanan.id_pemesanan} pesanan={pesanan} />
          ))}
        </div>
      )}
    </div>
  );
}