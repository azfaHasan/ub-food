'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { StatusPemesanan, TipeNotifikasi, StatusPembayaran, Role } from '@prisma/client';

async function getPemesananValid(id_pemesanan: string, id_akun_penjual: string) {
  const pemesanan = await prisma.pemesanan.findFirst({
    where: {
      id_pemesanan: id_pemesanan,
      Kantin: {
        Penjual: {
          id_akun: id_akun_penjual
        }
      }
    },
    include: {
      User: {
        include: {
          Akun: true
        }
      },
      Kantin: true,
      DetailPemesanan: true
    }
  });

  if (!pemesanan) {
    throw new Error("Pemesanan tidak ditemukan atau Anda tidak memiliki akses.");
  }
  
  if (!pemesanan.User.Akun) {
     throw new Error("Data akun user tidak ditemukan untuk pesanan ini.");
  }

  return pemesanan;
}

export async function prosesPesanan(id_pemesanan: string) {
  const session = await auth();
  if (session?.user?.role !== Role.PENJUAL || !session.user.akunId) {
    return { error: 'Anda tidak memiliki hak akses sebagai penjual.' };
  }

  try {
    const pemesanan = await getPemesananValid(id_pemesanan, session.user.akunId);

    if (pemesanan.status_pemesanan !== StatusPemesanan.PENDING) {
      return { error: 'Pesanan ini tidak lagi dalam status PENDING.' };
    }

    await prisma.$transaction([
      prisma.pemesanan.update({
        where: { id_pemesanan },
        data: { status_pemesanan: StatusPemesanan.DIPROSES }
      }),
      prisma.notifikasi.create({
        data: {
          id_akun_tujuan: pemesanan.User.Akun.id_akun,
          tipe_notifikasi: TipeNotifikasi.STATUS_UPDATE,
          isi_pesan: `Pesanan Anda #${id_pemesanan.substring(0, 5)} di ${pemesanan.Kantin.nama_kantin} sedang diproses.`,
          link_tujuan: `/user/riwayat/${id_pemesanan}`
        }
      })
    ]);
    
    revalidatePath(`/penjual/kantin/${pemesanan.id_kantin}/orders`);
    revalidatePath(`/user/riwayat/${id_pemesanan}`);
    
    return { success: 'Pesanan berhasil diproses.' };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function siapkanPesanan(id_pemesanan: string) {
  const session = await auth();
  if (session?.user?.role !== Role.PENJUAL || !session.user.akunId) {
    return { error: 'Anda tidak memiliki hak akses sebagai penjual.' };
  }

  try {
    const pemesanan = await getPemesananValid(id_pemesanan, session.user.akunId);

    if (pemesanan.status_pemesanan !== StatusPemesanan.DIPROSES) {
      return { error: 'Pesanan ini belum selesai diproses.' };
    }

    await prisma.$transaction([
      prisma.pemesanan.update({
        where: { id_pemesanan },
        data: { status_pemesanan: StatusPemesanan.SIAP_DIAMBIL }
      }),
      prisma.notifikasi.create({
        data: {
          id_akun_tujuan: pemesanan.User.Akun.id_akun,
          tipe_notifikasi: TipeNotifikasi.STATUS_UPDATE,
          isi_pesan: `Pesanan Anda #${id_pemesanan.substring(0, 5)} di ${pemesanan.Kantin.nama_kantin} sudah siap diambil.`,
          link_tujuan: `/user/riwayat/${id_pemesanan}`
        }
      })
    ]);
    
    revalidatePath(`/penjual/kantin/${pemesanan.id_kantin}/orders`);
    revalidatePath(`/user/riwayat/${id_pemesanan}`);
    
    return { success: 'Pesanan ditandai siap diambil.' };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function selesaikanPesanan(id_pemesanan: string) {
  const session = await auth();
  if (session?.user?.role !== Role.PENJUAL || !session.user.akunId) {
    return { error: 'Anda tidak memiliki hak akses sebagai penjual.' };
  }

  try {
    const pemesanan = await getPemesananValid(id_pemesanan, session.user.akunId);

    if (pemesanan.status_pemesanan !== StatusPemesanan.SIAP_DIAMBIL) {
      return { error: 'Pesanan ini belum siap diambil.' };
    }
    
    const dataUpdate: {
      status_pemesanan: StatusPemesanan,
      status_pembayaran?: StatusPembayaran,
      tanggal_pembayaran?: Date
    } = {
      status_pemesanan: StatusPemesanan.SELESAI
    };
    
    if (pemesanan.metode_pembayaran === 'TUNAI' || pemesanan.metode_pembayaran === 'QRIS') {
      dataUpdate.status_pembayaran = StatusPembayaran.LUNAS;
      dataUpdate.tanggal_pembayaran = new Date();
    }

    await prisma.$transaction([
      prisma.pemesanan.update({
        where: { id_pemesanan },
        data: dataUpdate
      }),
      prisma.notifikasi.create({
        data: {
          id_akun_tujuan: pemesanan.User.Akun.id_akun,
          tipe_notifikasi: TipeNotifikasi.STATUS_UPDATE,
          isi_pesan: `Pesanan Anda #${id_pemesanan.substring(0, 5)} telah selesai. Terima kasih!`,
          link_tujuan: `/user/riwayat/${id_pemesanan}`
        }
      })
    ]);
    
    revalidatePath(`/penjual/kantin/${pemesanan.id_kantin}/orders`);
    revalidatePath(`/user/riwayat/${id_pemesanan}`);
    
    return { success: 'Pesanan telah diselesaikan.' };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function batalkanPesanan(
  prevState: { error: string },
  formData: FormData
) {
  const session = await auth();
  if (session?.user?.role !== Role.PENJUAL || !session.user.akunId) {
    return { error: 'Anda tidak memiliki hak akses sebagai penjual.' };
  }

  const id_pemesanan = formData.get('id_pemesanan') as string;
  const alasan = formData.get('alasan') as string;

  if (!id_pemesanan || !alasan || alasan.trim() === '') {
    return { error: 'ID Pemesanan dan Alasan pembatalan diperlukan.' };
  }

  try {
    const pemesanan = await getPemesananValid(id_pemesanan, session.user.akunId);

    if (pemesanan.status_pemesanan === StatusPemesanan.SELESAI || 
        pemesanan.status_pemesanan === StatusPemesanan.DIBATALKAN) 
    {
      return { error: 'Pesanan ini sudah selesai atau sudah dibatalkan.' };
    }
    
    await prisma.$transaction(async (tx) => {
      await tx.pemesanan.update({
        where: { id_pemesanan },
        data: { status_pemesanan: StatusPemesanan.DIBATALKAN }
      });

      await tx.notifikasi.create({
        data: {
          id_akun_tujuan: pemesanan.User.Akun.id_akun,
          tipe_notifikasi: TipeNotifikasi.STATUS_UPDATE,
          isi_pesan: `Maaf, pesanan Anda #${id_pemesanan.substring(0, 5)} dibatalkan. Alasan: ${alasan}`,
          link_tujuan: `/user/riwayat/${id_pemesanan}` // Path riwayat baru
        }
      });

      for (const item of pemesanan.DetailPemesanan) {
        await tx.menu.update({
          where: { id_menu: item.id_menu },
          data: {
            stok_menu: {
              increment: item.jumlah_menu
            }
          }
        });
      }
    });
    
    revalidatePath(`/penjual/kantin/${pemesanan.id_kantin}/orders`);
    revalidatePath(`/user/riwayat/${id_pemesanan}`);
    
    return { error: '' };
  } catch (error) {
    return { error: (error as Error).message };
  }
}