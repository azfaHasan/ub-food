'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma, Role, StatusPemesanan, type Pemesanan, StatusPembayaran, MetodePembayaran, TipeNotifikasi } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
  
  if (session?.user?.role !== Role.PENJUAL || !session.user.akunId) {
    return { error: "Anda tidak memiliki izin untuk melakukan aksi ini." };
  }

  try {
    const pesanan = await prisma.pemesanan.findFirst({
      where: {
        id_pemesanan: id_pemesanan,
        Kantin: {
          Penjual: {
            id_akun: session.user.akunId
          }
        }
      },
      include: {
        User: { include: {Akun: true}},
        Kantin: true,
        DetailPemesanan: true
      }
    });

    if (!pesanan) {
      return { error: "Pesanan tidak ditemukan atau Anda tidak memiliki akses." };
    }
    if(!pesanan.User.Akun) {
      return { error: "Data akun user tidak ditemukan, tidak dapat mengirim notifikasi." };
    }

    const dataToUpdate: Prisma.PemesananUpdateInput = {
      status_pemesanan: newStatus,
    };

    if (newStatus === StatusPemesanan.SELESAI) {
      if (pesanan.metode_pembayaran === MetodePembayaran.TUNAI || pesanan.metode_pembayaran === MetodePembayaran.QRIS) {
        dataToUpdate.status_pembayaran = StatusPembayaran.LUNAS;
        dataToUpdate.tanggal_pembayaran = new Date();
      }
    }

    let notifMessage = '';
    switch (newStatus) {
      case StatusPemesanan.DIPROSES:
        notifMessage = `Pesanan Anda #${id_pemesanan.substring(0, 5)} di ${pesanan.Kantin.nama_kantin} sedang diproses.`;
        break;
      case StatusPemesanan.SIAP_DIAMBIL:
        notifMessage = `Pesanan Anda #${id_pemesanan.substring(0, 5)} di ${pesanan.Kantin.nama_kantin} sudah siap diambil.`;
        break;
      case StatusPemesanan.SELESAI:
        notifMessage = `Pesanan Anda #${id_pemesanan.substring(0, 5)} telah selesai. Terima kasih!`;
        break;
      case StatusPemesanan.DIBATALKAN:
        notifMessage = `Maaf, pesanan Anda #${id_pemesanan.substring(0, 5)} telah dibatalkan oleh penjual.`;
        break;
    }

    const [updatedPesanan] = await prisma.$transaction(async (tx) => {
      const updated = await tx.pemesanan.update({
        where: { id_pemesanan: id_pemesanan },
        data: dataToUpdate,
        include: { 
          User: { select: { nama_user: true } }, 
          DetailPemesanan: { 
            include: { Menu: { select: { nama_menu: true } } }
          } 
        },
      });

      if (notifMessage) {
        await tx.notifikasi.create({
          data: {
            id_akun_tujuan: pesanan.User.Akun.id_akun, // Kirim ke id_akun user
            tipe_notifikasi: TipeNotifikasi.STATUS_UPDATE,
            isi_pesan: notifMessage,
            link_tujuan: `/user/riwayat/${id_pemesanan}` // Arahkan ke halaman riwayat user
          }
        });
      }
      
      if (newStatus === StatusPemesanan.DIBATALKAN) {
        for (const item of pesanan.DetailPemesanan) {
          await tx.menu.update({
            where: { id_menu: item.id_menu },
            data: { stok_menu: { increment: item.jumlah_menu } }
          });
        }
      }
      
      return [updated];
    });

    revalidatePath(`/penjual/kantin/${pesanan.id_kantin}/orders`);
    revalidatePath(`/user/riwayat/${id_pemesanan}`);

    return { data: updatedPesanan };

  } catch (err) {
    console.error(err);
    return { error: "Terjadi kesalahan pada server." };
  }
}