import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NotifikasiItem from "@/components/NotifikasiItem";
import TandaiSemuaDibacaButton from "@/components/TandaiSemuaDibacaButton";

export default async function NotifikasiPage() {
  const session = await auth();
  if (!session?.user?.akunId) {
    redirect("/login");
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
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifikasi</h1>
        {adaYangBelumDibaca && (
          <TandaiSemuaDibacaButton />
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg">
        {daftarNotifikasi.length === 0 ? (
          <p className="text-gray-500 p-6 text-center">
            Anda belum memiliki notifikasi.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {daftarNotifikasi.map((notif) => (
              <NotifikasiItem key={notif.id_notifikasi} notif={notif} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}