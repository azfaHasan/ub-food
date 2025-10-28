import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function UserPage() {
  const session = await auth();

    if (!session) {
      redirect("/login");
    }

    return (
      <div>
        <h1>Ini Halaman User</h1>
        <p>Selamat datang, {session.user?.name}!</p>
        <p>Role Anda: {session.user?.role}</p>

        <Link href="/user/profile">
          <button style={{ padding: "8px 12px", cursor: "pointer", marginRight: "10px" }}>
            Edit Profile
          </button>
        </Link>
        
        <LogoutButton />
      </div>
    );
}