import { auth } from "@/auth";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

// Dashboard sementara aja ini, nanti mungkin bisa dibikin dashboard sendiri terus ditaruh di @/components biar tinggal import kalok mau dipakek
function DashboardButton({ role }: { role: string | undefined }) {
  const path =
    role === "ADMIN"
      ? "/admin"
      : role === "PENJUAL"
      ? "/penjual"
      : "/user";

  return (
  	<Link href={path}>
  	  <button style={{ padding: "10px", marginRight: "10px" }}>
  		Lihat Dashboard
  	  </button>
  	</Link>
  );
}

export default async function HomePage() {
  const session = await auth();

  return (
  	<div style={{ padding: "20px" }}>
  	  <nav
  		style={{
  		  display: "flex",
  		  justifyContent: "space-between",
  		  alignItems: "center",
  		  borderBottom: "1px solid #eee",
  		  paddingBottom: "10px",
  		}}
  	  >
  		<h1 style={{ margin: 0 }}>UB Food</h1>
  		<div>
  		  {!session ? (
  			<Link href="/login">
  			  <button style={{ padding: "10px" }}>Login</button>
  			</Link>
  		  ) : (
  			<div style={{ display: "flex", alignItems: "center" }}>
  			  <DashboardButton role={session.user?.role} />
  			  <LogoutButton />
  			</div>
  		  )}
  		</div>
  	  </nav>
  	  <main style={{ marginTop: "40px" }}>
  		<h2>Selamat Datang di Halaman Home!</h2>
  		<p>
  		  Di sini nanti akan tampil daftar kantin, menu-menu populer, dan
  		  fitur lainnya.
  		</p>
  		{/* Tempat hasil fetch data kantin */}
  	  </main>
  	</div>
  );
}