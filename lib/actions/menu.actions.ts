"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; // Pastikan path prisma benar
import { auth } from "@/auth"; // Pastikan path auth benar
import { Role } from "@prisma/client";

// Tipe ini sudah benar
export type FormState = {
  error: string | null;
  success: boolean;
};

// Fungsi ini sudah benar
async function canModifyMenu(kantinId: string) {
  const session = await auth();
  if (!session) return false;

  if (session.user.role === Role.ADMIN) {
    return true;
  }

  if (session.penjual?.id) {
    const kantin = await prisma.kantin.findFirst({
      where: {
        id_kantin: kantinId,
        id_penjual: session.penjual.id,
      },
    });

    return !!kantin;
  }

  return false;
}

export async function updateMenu(
  menuId: string,
  kantinId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const hasAccess = await canModifyMenu(kantinId);
  if (!hasAccess) {
    return {
      error: "Anda tidak memiliki izin untuk mengubah menu ini.",
      success: false,
    };
  }

  const nama_menu = formData.get("nama_menu") as string;
  const deskripsi_menu = formData.get("deskripsi_menu") as string;
  const harga_menu = parseInt(formData.get("harga_menu") as string, 10);
  const stok_menu = parseInt(formData.get("stok_menu") as string, 10);

  if (!nama_menu || isNaN(harga_menu) || isNaN(stok_menu)) {
    return {
      error: "Nama, harga, dan stok menu wajib diisi dan harus berupa angka.",
      success: false,
    };
  }
  if (harga_menu < 0 || stok_menu < 0) {
    return { error: "Harga dan stok tidak boleh negatif.", success: false };
  }

  try {
    await prisma.menu.update({
      where: {
        id_menu: menuId,
        // PERBAIKAN: Tambahkan cek id_kantin untuk keamanan
        id_kantin: kantinId,
      },
      data: {
        nama_menu: nama_menu,
        deskripsi_menu: deskripsi_menu,
        harga_menu: harga_menu,
        stok_menu: stok_menu,
      },
    });
  } catch (error) {
    console.error("Gagal update menu:", error);
    return { error: "Gagal menyimpan data ke database.", success: false };
  }

  revalidatePath(`/penjual/kantin/${kantinId}`);
  revalidatePath(`/admin/kantin/${kantinId}`);

  // Pola redirect ini sudah benar dan akan menghentikan eksekusi
  const session = await auth();
  if (session?.user.role === Role.ADMIN) {
    redirect(`/admin/kantin/${kantinId}`);
  } else {
    redirect(`/penjual/kantin/${kantinId}`);
  }
  // Catatan: redirect() akan 'throw' error, jadi tidak perlu 'return' di sini.
}

export async function deleteMenu(
  menuId: string,
  kantinId: string
): Promise<FormState> { // PERBAIKAN: Tambahkan tipe kembalian Promise<FormState>
  "use server";

  const hasAccess = await canModifyMenu(kantinId);
  if (!hasAccess) {
    console.error("Akses ditolak: Gagal menghapus menu.");
    // PERBAIKAN: Kembalikan objek FormState saat error
    return {
      success: false,
      error: "Akses ditolak. Anda tidak berhak menghapus menu ini.",
    };
  }

  try {
    await prisma.menu.delete({
      where: {
        id_menu: menuId,
        // PERBAIKAN: Tambahkan cek id_kantin untuk keamanan
        id_kantin: kantinId,
      },
    });
  } catch (error) {
    console.error("Gagal menghapus menu:", error);
    // PERBAIKAN: Kembalikan objek FormState saat error
    return {
      success: false,
      error: "Terjadi kesalahan database saat menghapus menu.",
    };
  }

  revalidatePath(`/penjual/kantin/${kantinId}`);
  revalidatePath(`/admin/kantin/${kantinId}`);

  // PERBAIKAN: Kembalikan objek FormState saat sukses
  return { success: true, error: null };
}