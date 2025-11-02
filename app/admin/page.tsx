import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminDashboardPage() {
  
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  if (session.user.role !== Role.ADMIN) {
    redirect("/"); 
  }

  const semuaKantin = await prisma.kantin.findMany({
    orderBy: {
      nama_kantin: 'asc'
    },
    include: {
      Penjual: {
        include: {
          Akun: {
            select: { username: true }
          }
        }
      }
    }
  });


  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
      <section className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-2">
          Dashboard Admin
        </h1>
        <p className="text-gray-600">Selamat datang, {session.user.name}.</p>
        <LogoutButton/>
      </section>
      <section className="p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Moderasi Kantin</h2>
        </div>

        {semuaKantin.length === 0 ? (
          <p className="text-gray-500">Belum ada kantin yang terdaftar di sistem.</p>
        ) : (
          <ul className="space-y-4">
            {semuaKantin.map((kantin) => (
              <li
                key={kantin.id_kantin}
                className="flex justify-between items-center border border-gray-200 p-4 rounded-lg"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{kantin.nama_kantin}</h3>
                  <small className="text-gray-500">Lokasi: {kantin.lokasi || "Belum diatur"}</small>
                  <br />
                  <small className="text-blue-600">
                    Pemilik: {kantin.Penjual.nama_penjual} ({kantin.Penjual.Akun.username})
                  </small>
                </div>
                <Link 
                  href={`/admin/kantin/${kantin.id_kantin}`}
                  className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 whitespace-nowrap"
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
