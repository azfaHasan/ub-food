"use client";

import { useState } from "react"; 
import type { User, Akun } from "@prisma/client";
import type { FormState } from "@/lib/actions/user.actions";

interface UserProfile extends User {
  akun: Akun;
}

interface ProfileFormProps {
  userProfile: UserProfile;
  updateUserAction: (
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

export default function UserEditForm({
  userProfile,
  updateUserAction,
}: ProfileFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const dummyPrevState: FormState = { error: null, success: false };
    const result = await updateUserAction(dummyPrevState, formData);

    if (result.error) {
      setError(result.error);
    }
    
    setIsPending(false);
  };

  if (!userProfile || !userProfile.akun) {
    return <div>Memuat data user...</div>; // Mungkin bisa diganti UI Loading kayak gif muter2
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col">
        <label htmlFor="nama" className="font-medium">Nama Lengkap</label>
        <input
          type="text"
          id="nama"
          name="nama"
          defaultValue={userProfile.nama_user || ""}
          className="w-full p-2 border rounded-md mt-1"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="username" className="font-medium">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          defaultValue={userProfile.akun.username || ""}
          className="w-full p-2 border rounded-md mt-1"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="email" className="font-medium">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={userProfile.akun.email || ""}
          className="w-full p-2 border rounded-md mt-1 bg-gray-100"
          readOnly
        />
        <small className="text-gray-500">Email tidak dapat diubah.</small>
      </div>

      <div className="flex flex-col">
        <label htmlFor="nomor_hp" className="font-medium">Nomor HP</label>
        <input
          type="tel"
          id="nomor_hp"
          name="nomor_hp"
          defaultValue={userProfile.no_hp_user || ""}
          placeholder="Contoh: 08123456789"
          className="w-full p-2 border rounded-md mt-1"
        />
      </div>
      <SubmitButton pending={isPending} />
    </form>
  );
}


