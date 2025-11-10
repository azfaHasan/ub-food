'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { MetodePembayaran, StatusPemesanan, StatusPembayaran, TipeNotifikasi } from '@prisma/client';

  type FormState = {
    error: string;
    success: boolean;
    id_pemesanan: string | null;
  };

export async function finalisasiPemesanan(
    prevState: FormState, 
    formData: FormData
  ) {
  
  const session = await auth();
  if (!session?.user?.id || !session.user.akunId) {
    return { 
          success: false, 
          id_pemesanan: null, 
      error: 'Anda harus login.' 
    };
  }

  const userId = session.user.id;
  const userAkunId = session.user.akunId;
  const userName = session.user.name || "User";
  const deskripsi = formData.get('deskripsi') as string | null;
  const metodePembayaran = formData.get('metode_pembayaran') as MetodePembayaran;

  const keranjang = await prisma.keranjang.findUnique({
    where: { id_user: userId },
    include: {
      DetailKeranjang: {
        include: {
          Menu: {
            include: {
              Kantin: {
                include: {
                  Penjual: true
                }
              }
            }
          },
        },
      },
    },
  });

  if (!keranjang || keranjang.DetailKeranjang.length === 0) {
    return {  
      success: false, 
      id_pemesanan: null, 
      error: 'Keranjang kosong.' 
    };
  }

  const detailItems = keranjang.DetailKeranjang;
  const kantinInfo = detailItems[0].Menu.Kantin;
  const idKantin = kantinInfo.id_kantin;
  const akunPenjualId = kantinInfo.Penjual.id_akun;

  try {
    const pemesananBaru = await prisma.$transaction(async (tx) => {
      let totalHarga = 0;
      for (const item of detailItems) {
        const menu = await tx.menu.findUnique({
          where: { id_menu: item.id_menu },
        });
        if (!menu || menu.stok_menu < item.jumlah) {
          throw new Error(`Stok untuk ${item.Menu.nama_menu} tidak mencukupi.`);
        }
        totalHarga += item.jumlah * item.Menu.harga_menu;
      }
      const pesanan = await tx.pemesanan.create({
        data: {
          id_user: userId,
          id_kantin: idKantin,
          total_harga: totalHarga,
          deskripsi_pemesanan: deskripsi,
          metode_pembayaran: metodePembayaran,
          status_pemesanan: StatusPemesanan.PENDING,
          status_pembayaran: StatusPembayaran.PENDING,
          nomor_antrean: 1,
        },
      });
      for (const item of detailItems) {
        await tx.detailPemesanan.create({
          data: {
            id_pemesanan: pesanan.id_pemesanan,
            id_menu: item.id_menu,
            jumlah_menu: item.jumlah,
            harga_satuan: item.Menu.harga_menu,
          },
        });
        await tx.menu.update({
          where: { id_menu: item.id_menu },
          data: {
            stok_menu: {
              decrement: item.jumlah,
            },
          },
        });
      }
      await tx.detailKeranjang.deleteMany({
        where: { id_keranjang: keranjang.id_keranjang },
      });
      await tx.notifikasi.create({
        data: {
          id_akun_tujuan: akunPenjualId,
          tipe_notifikasi: TipeNotifikasi.PESANAN_BARU,
          isi_pesan: `Pesanan baru #${pesanan.id_pemesanan.substring(0, 5)} dari ${userName}.`,
          link_tujuan: `/penjual/riwayat/${pesanan.id_pemesanan}`,
        }
      });
      await tx.notifikasi.create({
        data: {
          id_akun_tujuan: userAkunId,
          tipe_notifikasi: TipeNotifikasi.STATUS_UPDATE,
          isi_pesan: `Pesanan Anda #${pesanan.id_pemesanan.substring(0, 5)} di ${kantinInfo.nama_kantin} sedang menunggu konfirmasi.`,
          link_tujuan: `/user/riwayat/${pesanan.id_pemesanan}`,
        }
      });

      return pesanan;
    });
    return{
      success: true,
      error: '',
      id_pemesanan: pemesananBaru.id_pemesanan
    }
  } catch (error) {
    console.error(error);
    return { 
      success: false, 
      id_pemesanan: null, 
      error: (error as Error).message 
    };
  }
}