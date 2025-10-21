import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function UserPage() {
  const session = await auth();

    if (!session) {
      return <div>Menunggu</div>;
    }

    return (
      <div>
        <h1>Ini Halaman Penjual</h1>
        <p>Selamat datang, {session.user?.name}!</p>
        <p>Role Anda: {session.user?.role}</p>
        <LogoutButton />
      </div>
    );
}