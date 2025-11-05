'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function tambahKeKeranjang(menuId: string, jumlah: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Anda harus login untuk memesan.' };
  }
  const userId = session.user.id;

  if (jumlah <= 0) {
    return { error: 'Jumlah harus lebih dari 0.' };
  }

  const menu = await prisma.menu.findUnique({
    where: { id_menu: menuId },
    select: { stok_menu: true, id_kantin: true },
  });

  if (!menu) {
    return { error: 'Menu tidak ditemukan.' };
  }
  if (menu.stok_menu < jumlah) {
    return { error: 'Stok tidak mencukupi.' };
  }
  
  const keranjang = await prisma.keranjang.findUnique({
    where: { id_user: userId },
    include: { DetailKeranjang: { include: { Menu: true } } }
  });

  if (keranjang && keranjang.DetailKeranjang.length > 0) {
    const idKantinDiKeranjang = keranjang.DetailKeranjang[0].Menu.id_kantin;
    if (idKantinDiKeranjang !== menu.id_kantin) {
      return { error: 'Anda hanya bisa memesan dari satu kantin dalam satu waktu. Harap kosongkan keranjang Anda terlebih dahulu.' };
    }
  }

  let keranjangId: string;

  if (keranjang) {
    keranjangId = keranjang.id_keranjang;
  } else {
    const newKeranjang = await prisma.keranjang.create({
      data: { id_user: userId }
    });
    keranjangId = newKeranjang.id_keranjang;
  }
  
  const itemDiKeranjang = await prisma.detailKeranjang.findFirst({
    where: {
      id_keranjang: keranjangId,
      id_menu: menuId,
    },
  });

  if (itemDiKeranjang) {
    await prisma.detailKeranjang.update({
      where: { id_detail_keranjang: itemDiKeranjang.id_detail_keranjang },
      data: { jumlah: itemDiKeranjang.jumlah + jumlah },
    });
  } else {
    await prisma.detailKeranjang.create({
      data: {
        id_keranjang: keranjangId,
        id_menu: menuId,
        jumlah: jumlah,
      },
    });
  }

  revalidatePath('/user/keranjang');
  return { success: 'Menu ditambahkan ke keranjang.' };
}

export async function hapusItemKeranjang(id_detail_keranjang: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Otentikasi diperlukan.' };
  }

  try {
    const item = await prisma.detailKeranjang.findFirst({
      where: {
        id_detail_keranjang: id_detail_keranjang,
        Keranjang: {
          id_user: session.user.id
        }
      }
    });

    if (!item) {
      return { error: 'Item tidak ditemukan atau Anda tidak berhak.' };
    }
    await prisma.detailKeranjang.delete({
      where: { id_detail_keranjang: id_detail_keranjang }
    });
    
    revalidatePath('/user/keranjang');
    return { success: 'Item dihapus dari keranjang.' };

  } catch (error) {
    return { error: 'Gagal menghapus item.' };
  }
}