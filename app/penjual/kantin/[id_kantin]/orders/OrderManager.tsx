'use client';

import { useState, useEffect } from 'react';
import type { PesananAktifWithDetails } from './page'; // Impor tipe dari page.tsx
import { formatRupiah } from '@/lib/utils';
import { StatusPemesanan } from '@prisma/client';
import ManageOrderForm from './ManageOrderForm'; // Impor form aksi

/**
 * Komponen untuk menampilkan item di daftar pesanan sebelah kiri
 */
function OrderListItem({ 
  pesanan, 
  isSelected, 
  onSelect 
} : {
  pesanan: PesananAktifWithDetails,
  isSelected: boolean,
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`block w-full text-left p-4 rounded-2xl transition-all duration-200 ${
        isSelected 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white hover:bg-slate-50 border border-slate-200'
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <h3 className={`font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
          Order #{pesanan.id_pemesanan.substring(0, 5)}
        </h3>
        <span 
          className={`px-2 py-0.5 rounded text-xs font-semibold ${
            isSelected 
              ? 'bg-white/20 text-white' 
              : pesanan.status_pemesanan === 'PENDING' ? 'bg-yellow-100 text-yellow-800'
              : pesanan.status_pemesanan === 'DIPROSES' ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}
        >
          {pesanan.status_pemesanan.replace('_', ' ')}
        </span>
      </div>
      <p className={`text-sm ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>
        Customer: {pesanan.User.nama_user}
      </p>
    </button>
  );
}

/**
 * Komponen untuk menampilkan detail menu dan catatan di sebelah kanan
 */
function OrderDetailView({ pesanan }: { pesanan: PesananAktifWithDetails }) {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-slate-900 mb-3">Detail Pesanan</h3>
      <div className="space-y-3">
        {pesanan.DetailPemesanan.map(item => (
          <div key={item.id_detail} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-semibold text-slate-800">{item.Menu.nama_menu}</p>
              <p className="text-sm text-slate-600">
                {item.jumlah_menu} x {formatRupiah(item.harga_satuan)}
              </p>
            </div>
            <p className="text-lg font-bold text-slate-900">
              {formatRupiah(item.jumlah_menu * item.harga_satuan)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
        <h4 className="text-lg font-bold text-slate-900">Total</h4>
        <p className="text-2xl font-bold text-emerald-600">
          {formatRupiah(pesanan.total_harga)}
        </p>
      </div>

      {pesanan.deskripsi_pemesanan && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <h4 className="font-semibold text-yellow-800">Catatan dari Pelanggan:</h4>
          <p className="text-sm text-yellow-700 mt-1">{pesanan.deskripsi_pemesanan}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Komponen Utama Pengelola Order (UI Interaktif)
 */
export default function OrderManager({ initialPesanan }: { initialPesanan: PesananAktifWithDetails[] }) {
  
  // State untuk menyimpan daftar pesanan
  const [pesananList, setPesananList] = useState(initialPesanan);
  // State untuk menyimpan pesanan mana yang sedang dipilih
  const [selectedPesanan, setSelectedPesanan] = useState<PesananAktifWithDetails | null>(null);

  // Efek untuk memilih pesanan pertama saat komponen dimuat
  useEffect(() => {
    if (pesananList.length > 0) {
      setSelectedPesanan(pesananList[0]);
    } else {
      setSelectedPesanan(null);
    }
  }, [pesananList]); // Bergantung pada pesananList

  // Fungsi callback untuk memperbarui daftar UI
  // saat pesanan diselesaikan atau dibatalkan
  const handleOrderStatusUpdate = (updatedPesanan: PesananAktifWithDetails) => {
    
    const newStatus = updatedPesanan.status_pemesanan;

    if (newStatus === StatusPemesanan.SELESAI || newStatus === StatusPemesanan.DIBATALKAN) {
      // Hapus pesanan dari daftar UI
      const newList = pesananList.filter(p => p.id_pemesanan !== updatedPesanan.id_pemesanan);
      setPesananList(newList);
      // Pilih item berikutnya, atau null jika daftar kosong
      setSelectedPesanan(newList[0] || null);
    } else {
      // Perbarui item dalam daftar
      const newList = pesananList.map(p => 
        p.id_pemesanan === updatedPesanan.id_pemesanan ? updatedPesanan : p
      );
      setPesananList(newList);
      // Tetap pilih item yang baru diupdate
      setSelectedPesanan(updatedPesanan);
    }
  };

  if (pesananList.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <p className="text-center text-slate-600 py-12">
          Tidak ada pesanan aktif saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Kolom Kiri: Daftar Pesanan */}
      <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Update Status Pesanan</h2>
        <div className="space-y-3">
          {pesananList.map(pesanan => (
            <OrderListItem
              key={pesanan.id_pemesanan}
              pesanan={pesanan}
              isSelected={selectedPesanan?.id_pemesanan === pesanan.id_pemesanan}
              onSelect={() => setSelectedPesanan(pesanan)}
            />
          ))}
        </div>
      </div>

      {/* Kolom Kanan: Detail dan Form Aksi */}
      <div className="lg:col-span-2">
        {selectedPesanan ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Manage Order</h2>
            {/* Form Aksi dari Gambar */}
            <ManageOrderForm 
              key={selectedPesanan.id_pemesanan} // Reset form saat pesanan ganti
              pesanan={selectedPesanan}
              onStatusUpdate={handleOrderStatusUpdate}
            />
            {/* Detail Pesanan (Menu, Total, Catatan) */}
            <OrderDetailView pesanan={selectedPesanan} />
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <p className="text-center text-slate-500 py-24">Pilih pesanan di sebelah kiri untuk melihat detail.</p>
          </div>
        )}
      </div>
    </div>
  );
}