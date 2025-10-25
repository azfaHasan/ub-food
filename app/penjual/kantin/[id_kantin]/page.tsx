export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { getAuthenticatedPenjual } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

interface DetailKantinPageProps {
  params: {
    id_kantin: string;
  };
}

function formatJam(date: Date | null): string {
  if (!date) return "Belum diatur";
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export default async function DetailKantinPage({
  params,
}: DetailKantinPageProps) {

  let penjual;
  try {
  	penjual = await getAuthenticatedPenjual();
  } catch (error) {
  	redirect("/login");
  }

if (!penjual) {
    return notFound();
}

  const kantin = await prisma.kantin.findFirst({
  	where: {
  	  id_kantin: params.id_kantin,
  	  id_penjual: penjual.id_penjual,
  	},
  });

  if (!kantin) {
  	 notFound();
  }

  const daftarMenu = await prisma.menu.findMany({
  	where: {
  	  id_kantin: params.id_kantin,
  	},
    orderBy: {
      nama_menu: 'asc' 
    }
  });

  return (
  	<div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
  	  <section style={{ marginBottom: "30px" }}>
  		<h1>{kantin.nama_kantin}</h1>
  		<p>
  		  {kantin.deskripsi_kantin || "Penjual belum menambahkan deskripsi."}
  		</p>
  		<p>
  		  <strong>Lokasi:</strong> {kantin.lokasi || "Belum diatur"}
  		</p>
  		<p>
  		  <strong>Jam Buka:</strong> {formatJam(kantin.jam_buka)} -{" "}
  		  {formatJam(kantin.jam_tutup)}
  		</p>
  	  </section>

  	  <hr />

  	  <section style={{ marginTop: "30px" }}>
  		<h2>Daftar Menu</h2>
  		
  		<Link href={`/penjual/kantin/${params.id_kantin}/add-menu`}>
  		  <button
  			style={{
  			  padding: "10px 15px",
  			  fontSize: "16px",
  			  marginBottom: "20px",
  			  cursor: "pointer",
  			}}
  		  >
  			+ Tambah Menu Baru
  		  </button>
  		</Link>

  		{daftarMenu.length === 0 ? (
  		  <p>Belum ada menu di kantin ini. Silakan tambahkan menu.</p>
  		) : (
  		  <ul style={{ listStyle: "none", padding: 0 }}>
  			{daftarMenu.map((menu) => (
  			  <li
  				key={menu.id_menu}
  				style={{
  				  border: "1px solid #eee",
  				  padding: "15px",
  				  marginBottom: "10px",
  				}}
  			  >
  				<h3 style={{ margin: 0 }}>{menu.nama_menu}</h3>
  				<p style={{ margin: "5px 0" }}>
  				  {menu.deskripsi_menu || "Tidak ada deskripsi menu."}
  				</p>
  				<strong style={{ color: "green" }}>Rp {menu.harga_menu}</strong>
  			  </li>
  			))}
  		  </ul>
  		)}
  	  </section>
  	</div>
  );
}
