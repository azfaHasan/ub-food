'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function tandaiSudahDibaca(id_notifikasi: string) {
  const session = await auth();
  if (!session?.user?.akunId) {
    return { error: "User tidak terautentikasi" };
  }

  try {
    const notif = await prisma.notifikasi.findFirst({
      where: {
        id_notifikasi: id_notifikasi,
        id_akun_tujuan: session.user.akunId,
      }
    });

    if (!notif) {
      return { error: "Notifikasi tidak ditemukan" };
    }

    if (!notif.status_baca) {
      await prisma.notifikasi.update({
        where: { id_notifikasi: id_notifikasi },
        data: { status_baca: true },
      });
    }

    revalidatePath('/user/notifikasi');
    revalidatePath('/penjual/notifikasi');
    
    return { success: true, link: notif.link_tujuan };

  } catch (error) {
    return { error: "Gagal memperbarui notifikasi" };
  }
}

export async function tandaiSemuaDibaca() {
  const session = await auth();
  if (!session?.user?.akunId) {
    return { error: "User tidak terautentikasi" };
  }

  try {
    await prisma.notifikasi.updateMany({
      where: {
        id_akun_tujuan: session.user.akunId,
        status_baca: false,
      },
      data: { status_baca: true },
    });
    
    revalidatePath('/user/notifikasi');
    revalidatePath('/penjual/notifikasi');
    return { success: true };

  } catch (error) {
    return { error: "Gagal memperbarui notifikasi" };
  }
}