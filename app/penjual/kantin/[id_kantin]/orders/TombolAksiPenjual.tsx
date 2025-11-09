'use client';

import { 
  prosesPesanan, 
  siapkanPesanan, 
  selesaikanPesanan,
  batalkanPesanan 
} from '@/actions/penjual';
import { Pemesanan, StatusPemesanan } from '@prisma/client';
import { useTransition, useState } from 'react';
import { useActionState } from 'react';

type BatalState = {
  error: string;
};
const initialState: BatalState = {
  error: '',
};

export default function TombolAksiPenjual({ pesanan }: { pesanan: Pemesanan }) {
  
    const [isPending, startTransition] = useTransition();
  const [showBatalForm, setShowBatalForm] = useState(false);
  const [batalState, batalFormAction] = useActionState(batalkanPesanan, initialState);

  const handleProses = () => {
    startTransition(async () => {
      await prosesPesanan(pesanan.id_pemesanan);
    });
  };

  const handleSiap = () => {
    startTransition(async () => {
      await siapkanPesanan(pesanan.id_pemesanan);
    });
  };
  
  const handleSelesai = () => {
    if (confirm('Anda yakin ingin menyelesaikan pesanan ini?')) {
      startTransition(async () => {
        await selesaikanPesanan(pesanan.id_pemesanan);
      });
    }
  };

  return (
    <div className="mt-4 pt-4 border-t space-y-2">
      <div className="flex gap-2">
        {pesanan.status_pemesanan === StatusPemesanan.PENDING && (
          <button
            onClick={handleProses}
            disabled={isPending}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium disabled:bg-gray-400"
          >
            {isPending ? 'Memproses...' : 'Proses Pesanan'}
          </button>
        )}

        {pesanan.status_pemesanan === StatusPemesanan.DIPROSES && (
          <button
            onClick={handleSiap}
            disabled={isPending}
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm font-medium disabled:bg-gray-400"
          >
            {isPending ? 'Menyiapkan...' : 'Siap Diambil'}
          </button>
        )}
        
        {pesanan.status_pemesanan === StatusPemesanan.SIAP_DIAMBIL && (
          <button
            onClick={handleSelesai}
            disabled={isPending}
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded text-sm font-medium disabled:bg-gray-400"
          >
            {isPending ? 'Menyelesaikan...' : 'Selesaikan Pesanan'}
          </button>
        )}
      </div>
      
      {!showBatalForm && pesanan.status_pemesanan !== StatusPemesanan.SELESAI && (
        <button
          onClick={() => setShowBatalForm(true)}
          disabled={isPending}
          className="w-full px-3 py-1 bg-transparent text-red-600 rounded text-sm font-medium hover:bg-red-50 disabled:text-gray-400"
        >
          Batalkan Pesanan
        </button>
      )}

      {showBatalForm && (
        <form action={batalFormAction} className="space-y-2 p-2 border border-red-200 rounded">
          <input type="hidden" name="id_pemesanan" value={pesanan.id_pemesanan} />
          <label htmlFor="alasan" className="block text-xs font-medium text-gray-700">
            Alasan Pembatalan
          </label>
          <input
            type="text"
            id="alasan"
            name="alasan"
            required
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="Contoh: Stok habis"
          />
          {batalState?.error && (
            <p className="text-xs text-red-600">{batalState.error}</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-3 py-1 bg-red-600 text-white rounded text-sm font-medium disabled:bg-gray-400"
            >
              Konfirmasi Batal
            </button>
            <button
              type="button"
              onClick={() => setShowBatalForm(false)}
              className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium"
            >
              Kembali
            </button>
          </div>
        </form>
      )}
    </div>
  );
}