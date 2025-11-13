// Path: app/penjual/kantin/[id_kantin]/orders/ManageOrderForm.tsx

'use client';

import { useState, useTransition } from 'react';
import type { PesananAktifWithDetails } from './page';
import { StatusPemesanan } from '@prisma/client';
import { updatePemesananStatus } from '@/actions/pesanan.actions'; // Action baru

// Tipe untuk props
interface ManageOrderFormProps {
  pesanan: PesananAktifWithDetails;
  onStatusUpdate: (updatedPesanan: PesananAktifWithDetails) => void;
}

export default function ManageOrderForm({ pesanan, onStatusUpdate }: ManageOrderFormProps) {
  // State untuk melacak status yang dipilih di UI
  const [selectedStatus, setSelectedStatus] = useState(pesanan.status_pemesanan);
  // State untuk loading
  const [isPending, startTransition] = useTransition();
  // State untuk error
  const [error, setError] = useState<string | null>(null);
  
  // Tombol Aksi Utama (Update, Selesai, Batalkan)
  const handleAction = (newStatus: StatusPemesanan) => {
    setError(null);
    startTransition(async () => {
      const result = await updatePemesananStatus(pesanan.id_pemesanan, newStatus);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        // Panggil callback untuk memperbarui UI di parent
        onStatusUpdate(result.data as PesananAktifWithDetails);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Toggles Status (Sesuai Gambar) */}
      <div className="flex gap-3">
        {/* Tombol Pending */}
        <StatusToggleButton
          label="PENDING"
          isActive={selectedStatus === StatusPemesanan.PENDING}
          onClick={() => setSelectedStatus(StatusPemesanan.PENDING)}
        />
        {/* Tombol Preparing (DIPROSES) */}
        <StatusToggleButton
          label="DIPROSES"
          isActive={selectedStatus === StatusPemesanan.DIPROSES}
          onClick={() => setSelectedStatus(StatusPemesanan.DIPROSES)}
        />
        {/* Tombol Ready for Pickup (SIAP_DIAMBIL) */}
        <StatusToggleButton
          label="SIAP DIAMBIL"
          isActive={selectedStatus === StatusPemesanan.SIAP_DIAMBIL}
          onClick={() => setSelectedStatus(StatusPemesanan.SIAP_DIAMBIL)}
        />
      </div>

      {/* Estimate Completion Time (Sesuai Gambar) */}
      <div>
        <label htmlFor="estimate_time" className="block text-sm font-medium text-slate-700 mb-1">
          Estimate Completion Time
        </label>
        <input
          type="text"
          id="estimate_time"
          name="estimate_time"
          className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          placeholder="ex. 20 minutes"
        />
      </div>

      {/* Pesan Error */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Tombol Aksi (Sesuai Gambar + Tombol Tambahan) */}
      <div className="flex flex-wrap gap-3">
        {/* Tombol Update Order Status */}
        <button
          onClick={() => handleAction(selectedStatus)}
          disabled={isPending || selectedStatus === pesanan.status_pemesanan}
          className="flex-1 inline-flex justify-center items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:bg-slate-400"
        >
          {isPending ? 'Updating...' : 'Update Order Status'}
        </button>
        
      </div>

      {/* Tombol Aksi Tambahan (Wajib ada untuk alur kerja) */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleAction(StatusPemesanan.SELESAI)}
          disabled={isPending}
          className="flex-1 inline-flex justify-center items-center px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-sm disabled:bg-slate-400"
        >
          Selesaikan Pesanan
        </button>
        <button
          onClick={() => handleAction(StatusPemesanan.DIBATALKAN)}
          disabled={isPending}
          className="flex-1 inline-flex justify-center items-center px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-sm disabled:bg-slate-400"
        >
          Batalkan Pesanan
        </button>
      </div>
    </div>
  );
}

// Komponen helper untuk tombol toggle
function StatusToggleButton({ 
  label, 
  isActive, 
  onClick 
} : { 
  label: string, 
  isActive: boolean, 
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );
}