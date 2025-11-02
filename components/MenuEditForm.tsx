"use client";

import { useState } from "react"; 
import type { Menu } from "@prisma/client";
import type { FormState } from "@/lib/actions/menu.actions";

interface MenuFormProps {
  menu: Menu;
  updateMenuAction: (
    prevState: FormState,
    formData: FormData
  ) => Promise<FormState>;
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </button>
  );
}

export default function MenuEditForm({
  menu,
  updateMenuAction,
}: MenuFormProps) {
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const dummyPrevState: FormState = { error: null, success: false };
    
    const result = await updateMenuAction(dummyPrevState, formData);

    if (result.error) {
      setError(result.error);
    }
    
    setIsPending(false); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {error}
        </div>
      )}
      <div className="flex flex-col">
        <label htmlFor="nama_menu" className="font-medium">Nama Menu</label>
        <input
          type="text"
          id="nama_menu"
          name="nama_menu"
          defaultValue={menu.nama_menu}
          className="w-full p-2 border rounded-md mt-1"
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="deskripsi_menu" className="font-medium">Deskripsi Menu</label>
        <textarea
          id="deskripsi_menu"
          name="deskripsi_menu"
          defaultValue={menu.deskripsi_menu || ""}
          className="w-full p-2 border rounded-md mt-1"
          rows={3}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="harga_menu" className="font-medium">Harga (Rp)</label>
        <input
          type="number"
          id="harga_menu"
          name="harga_menu"
          defaultValue={menu.harga_menu}
          className="w-full p-2 border rounded-md mt-1"
          min="0"
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="stok_menu" className="font-medium">Stok</label>
        <input
          type="number"
          id="stok_menu"
          name="stok_menu"
          defaultValue={menu.stok_menu}
          className="w-full p-2 border rounded-md mt-1"
          min="0"
          required
        />
      </div>
      
      <SubmitButton pending={isPending} />
    </form>
  );
}
