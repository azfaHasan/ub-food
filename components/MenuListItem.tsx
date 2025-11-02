"use client";

import type { Menu } from "@prisma/client";
import Link from "next/link";
import { useTransition } from "react";
import { deleteMenu } from "@/lib/actions/menu.actions";
import type { FormState } from "@/lib/actions/menu.actions";

interface MenuListItemProps {
  menu: Menu;
  baseUrl: string;
}

export default function MenuListItem({ menu, baseUrl }: MenuListItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    console.log("Menghapus... (implementasikan modal konfirmasi di sini)");

startTransition(async () => {
      // PERBAIKAN 1: Tambahkan menu.id_kantin
      // PERBAIKAN 2: Asumsikan deleteMenu mengembalikan objek { error: ... }
      // dan tidak melempar error, sehingga try...catch dihapus.
      const result = await deleteMenu(menu.id_menu, menu.id_kantin);

      if (result?.error) {
        console.error(`Gagal menghapus: ${result.error}`);
        // TODO: Tampilkan notifikasi/toast error ke pengguna
      } else {
        // Sukses! revalidatePath sudah dipanggil di server action.
        console.log("Menu berhasil dihapus.");
        // TODO: Tampilkan notifikasi/toast sukses ke pengguna
      }
    });
  };

  const stokHabis = menu.stok_menu === 0;

  return (
    <li className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-gray-200 p-4 rounded-lg">
      <div className="flex-grow">
        <h3
          className={`text-xl font-semibold ${
            stokHabis ? "text-gray-400 line-through" : "text-gray-800"
          }`}
        >
          {menu.nama_menu}
        </h3>
        <p
          className={`my-1 ${
            stokHabis ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {menu.deskripsi_menu || "Tidak ada deskripsi menu."}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <strong
            className={`text-lg ${
              stokHabis ? "text-gray-400 line-through" : "text-green-600"
            }`}
          >
            Rp {menu.harga_menu}
          </strong>
          <span
            className={`font-medium px-2 py-0.5 rounded-full text-sm ${
              stokHabis
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            Stok: {stokHabis ? "Habis" : menu.stok_menu}
          </span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
        <Link
          href={`${baseUrl}/edit-menu/${menu.id_menu}`}
          className="px-4 py-2 text-center bg-yellow-500 text-white rounded-md hover:bg-yellow-600 whitespace-nowrap"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 whitespace-nowrap"
        >
          {isPending ? "Menghapus..." : "Hapus"}
        </button>
      </div>
    </li>
  );
}

