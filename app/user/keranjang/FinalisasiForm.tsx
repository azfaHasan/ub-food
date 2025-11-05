'use client';

import { useFormState } from 'react-dom';
import { finalisasiPemesanan } from '@/actions/pemesanan';
import { MetodePembayaran } from '@prisma/client';
import SubmitButton from '@/components/SubmitButton';

const initialState = {
  error: '',
};

export default function FinalisasiForm() {

  const [state, formAction] = useFormState(finalisasiPemesanan, initialState);

  return (
    <form action={formAction} className="p-6 space-y-4">
      <div>
        <label htmlFor="metode_pembayaran" className="block text-sm font-medium text-gray-700">
          Metode Pembayaran
        </label>
        <select
          id="metode_pembayaran"
          name="metode_pembayaran"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value={MetodePembayaran.TUNAI}>Tunai</option>
          <option value={MetodePembayaran.QRIS}>QRIS</option>
        </select>
      </div>

      <div>
        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
          Catatan (Opsional)
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Contoh: Tidak pakai saus, sambal dipisah..."
        ></textarea>
      </div>
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      <SubmitButton text="Finalisasi Pemesanan" />
    </form>
  );
}