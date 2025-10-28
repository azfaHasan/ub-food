import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function UserPage() {
  const session = await auth();

    if (!session) {
      redirect("/login");
    }

    return (
      <div>
        <h1>Ini Halaman Admin</h1>
        <p>Selamat datang, {session.user?.name}!</p>
        <p>Role Anda: {session.user?.role}</p>
        <LogoutButton />
      </div>
    );
}