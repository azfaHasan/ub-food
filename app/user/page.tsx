import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserPage() {
  
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userData = await prisma.user.findUnique({
    where: { id_user: session.user.id },
    include: {
      Akun: { 
        select: { username: true, email: true }
      }
    }
  });

  if (!userData || !userData.Akun) {
    return <div>Data user tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">
        Selamat datang, {userData.Akun.username}
      </h1>
      
      <p className="mb-2">Nama User: {userData.nama_user}</p>
      <p className="mb-2">Email: {userData.Akun.email}</p>
      <p className="mb-6">Nomor HP: {userData.no_hp_user || "Belum diisi"}</p>

      <Link href="/user/profile" className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
        Edit Profile
      </Link>
      <LogoutButton/>
    </div>
  );
}