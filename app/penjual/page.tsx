import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";
import { getAuthenticatedPenjual } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PenjualDashboardPage() {
  const session = await auth();

  let penjual;
  try {
  	penjual = await getAuthenticatedPenjual();
  } catch (error) {
  	redirect("/");
  }

  if (!penjual) {
  	redirect("/");
  }

  const daftarKantin = await prisma.kantin.findMany({
  	where: {
  	  id_penjual: penjual.id_penjual,
  	},
  	orderBy: {
  	  nama_kantin: "asc",
  	},
  });

  return (
  	<div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
  	  <h1>Dashboard Penjual</h1>
  	  <p>Selamat datang, {session?.user?.name || "Penjual"}!</p>
  	  <p>Role Anda: {session?.user?.role}</p>
  	  <LogoutButton />
  	  <hr style={{ margin: "20px 0" }} />
  	  <section>
  		<h2>Kantin Anda</h2>
  		<Link href="/penjual/kantin/create">
  		  <button
  			style={{
  			  padding: "10px 15px",
  			  fontSize: "16px",
  			  marginBottom: "20px",
  			  cursor: "pointer",
  			  backgroundColor: "#007bff",
  			  color: "white",
  			  border: "none",
  			  borderRadius: "5px"
  			}}
  		  >
  			+ Buat Kantin Baru
  		  </button>
  		</Link>

  		{daftarKantin.length === 0 ? (
  		  <p>Anda belum memiliki kantin. Silakan buat kantin baru.</p>
  		) : (
  		  <ul style={{ listStyle: "none", padding: 0 }}>
  			{daftarKantin.map((kantin) => (
  			  <li
  				key={kantin.id_kantin}
  				style={{
  				  display: "flex",
  				  justifyContent: "space-between",
  				  alignItems: "center",
  				  border: "1px solid #ddd",
  				  padding: "15px",
  				  marginBottom: "10px",
  				  borderRadius: "5px"
  				}}
  			  >
  				<div>
  				  <h3 style={{ margin: 0 }}>{kantin.nama_kantin}</h3>
  				  <small>{kantin.lokasi || "Lokasi belum diatur"}</small>
  				</div>
  				<Link href={`/penjual/kantin/${kantin.id_kantin}`}>
  				  <button style={{ padding: "8px 12px", cursor: "pointer" }}>
  					Kelola / Lihat Detail
  				  </button>
  				</Link>
  			  </li>
  			))}
  		  </ul>
  		)}
  	  </section>
  	</div>
  );
}