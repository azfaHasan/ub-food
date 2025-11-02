import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PenjualDashboardPage() {
  
  const session = await auth();

  if (!session?.penjual?.id) {
    redirect("/login");
  }

  const penjualData = await prisma.penjual.findUnique({
    where: { id_penjual: session.penjual.id },
    include: {
      Akun: { 
        select: { username: true, email: true }
      }
    }
  });

  const daftarKantin = await prisma.kantin.findMany({
    where: {
      id_penjual: session.penjual.id
    },
    orderBy: {
      nama_kantin: 'asc'
    }
  });

  if (!penjualData || !penjualData.Akun) {
    return <div>Data penjual tidak ditemukan.</div>;
  }
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">
        Selamat datang, {penjualData.Akun.username}
      </h1>
      
      <p className="mb-2">Nama Toko/Penjual: {penjualData.nama_penjual}</p>
      <p className="mb-2">Email: {penjualData.Akun.email}</p>
      <p className="mb-6">Nomor HP: {penjualData.no_hp_penjual || "Belum diisi"}</p>

      <Link href="/penjual/profile" className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
        Edit Profile
      </Link>
      <LogoutButton/>
      <section className="p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Kantin Anda</h2>
          <Link href="/penjual/kantin/create">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
            >
              + Buat Kantin Baru
            </button>
          </Link>
        </div>

        {daftarKantin.length === 0 ? (
          <p className="text-gray-500">Anda belum memiliki kantin. Silakan buat kantin baru.</p>
        ) : (
          <ul className="space-y-4">
            {daftarKantin.map((kantin) => (
              <li
                key={kantin.id_kantin}
                className="flex justify-between items-center border border-gray-200 p-4 rounded-lg"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{kantin.nama_kantin}</h3>
                  <small className="text-gray-500">{kantin.lokasi || "Lokasi belum diatur"}</small>
                </div>
                <Link 
                  href={`/penjual/kantin/${kantin.id_kantin}`}
                  className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Kelola Kantin
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}