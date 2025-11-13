// Path: lib/actions/pesanan.actions.ts

'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Role, StatusPemesanan, type Pemesanan } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Definisikan tipe return
type ActionResult = {
  error?: string;
  data?: Pemesanan & {
    User: { nama_user: string };
    DetailPemesanan: (
      { Menu: { nama_menu: string } }
    )[]
  };
}

export async function updatePemesananStatus(
  id_pemesanan: string, 
  newStatus: StatusPemesanan
): Promise<ActionResult> {
  
  const session = await auth();
  
  // Keamanan: Pastikan yang update adalah PENJUAL
  if (session?.user?.role !== Role.PENJUAL || !session.user.akunId) {
    return { error: "Anda tidak memiliki izin untuk melakukan aksi ini." };
  }

  try {
    // Verifikasi bahwa penjual ini memiliki pesanan tersebut
    const pesanan = await prisma.pemesanan.findFirst({
      where: {
        id_pemesanan: id_pemesanan,
        Kantin: {
          Penjual: {
            id_akun: session.user.akunId
          }
        }
      }
    });

    if (!pesanan) {
      return { error: "Pesanan tidak ditemukan atau Anda tidak memiliki akses." };
    }

    // Lakukan Update Status
    const updatedPesanan = await prisma.pemesanan.update({
      where: { id_pemesanan: id_pemesanan },
      data: { status_pemesanan: newStatus },
      include: { 
        User: { select: { nama_user: true } }, 
        DetailPemesanan: { 
          include: { Menu: { select: { nama_menu: true } } }
        } 
      },
    });

    // Revalidasi path agar halaman utama me-refresh
    revalidatePath(`/penjual/kantin/${pesanan.id_kantin}/orders`);

    return { data: updatedPesanan };

  } catch (err) {
    console.error(err);
    return { error: "Terjadi kesalahan pada server." };
  }
}