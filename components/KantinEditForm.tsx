"use client";

import { useState } from "react"; 
import type { Kantin } from "@prisma/client";
import type { FormState } from "@/lib/actions/kantin.actions";

interface KantinFormProps {
  kantin: Kantin;
  updateKantinAction: (
    prevState: FormState,
    formData: FormData
  ) => Promise<FormState>;
}

function formatDateToTimeInput(date: Date | null): string {
  if (!date) return "";

  const d = new Date(date);
  const hours = d.getUTCHours().toString().padStart(2, '0');
  const minutes = d.getUTCMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
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

export default function KantinEditForm({
  kantin,
  updateKantinAction,
}: KantinFormProps) {
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  
  const defaultJamBuka = formatDateToTimeInput(kantin.jam_buka);
  const defaultJamTutup = formatDateToTimeInput(kantin.jam_tutup);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const dummyPrevState: FormState = { error: null, success: false };
    
    const result = await updateKantinAction(dummyPrevState, formData);

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
        <label htmlFor="deskripsi_kantin" className="font-medium">Deskripsi Kantin</label>
        <textarea
          id="deskripsi_kantin"
          name="deskripsi_kantin"
          defaultValue={kantin.deskripsi_kantin || ""}
          className="w-full p-2 border rounded-md mt-1"
          rows={4}
          placeholder="Tulis deskripsi singkat tentang kantin Anda..."
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="jam_buka" className="font-medium">Jam Buka</label>
        <input
          type="time"
          id="jam_buka"
          name="jam_buka"
          defaultValue={defaultJamBuka}
          className="w-full p-2 border rounded-md mt-1"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="jam_tutup" className="font-medium">Jam Tutup</label>
        <input
          type="time"
          id="jam_tutup"
          name="jam_tutup"
          defaultValue={defaultJamTutup}
          className="w-full p-2 border rounded-md mt-1"
        />
      </div>
      
      <SubmitButton pending={isPending} />
    </form>
  );
}
