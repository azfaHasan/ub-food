'use client';

import { useState, useTransition } from 'react';
import { Menu } from '@prisma/client';
import { formatRupiah } from '@/lib/utils';
import { tambahKeKeranjang } from '@/actions/keranjang'; 

interface MenuUserCardProps {
  menu: Menu;
}

export default function MenuUserCard({ menu }: MenuUserCardProps) {
  const [jumlah, setJumlah] = useState(1);
  const [isPending, startTransition] = useTransition();
  const handlePesan = () => {
    if (jumlah <= 0) {
      alert("Jumlah pesanan harus minimal 1.");
      return;
    }
    if (jumlah > menu.stok_menu) {
      alert(`Stok tidak mencukupi. Stok tersisa: ${menu.stok_menu}`);
      return;
    }

    startTransition(async () => {
      const result = await tambahKeKeranjang(menu.id_menu, jumlah);
      
      if (result?.error) {
        alert("Gagal menambahkan ke keranjang: " + result.error);
      } else {
        alert("Sukses ditambahkan ke keranjang!");
        setJumlah(1);
      }
    });
  };

  const stokHabis = menu.stok_menu <= 0;

  return (
    <li className={`p-4 border rounded-lg ${stokHabis ? 'bg-gray-200' : 'bg-white'} shadow-sm`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="flex-1 mb-4 sm:mb-0">
          <h4 className="text-lg font-semibold">{menu.nama_menu}</h4>
          <p className="text-sm text-gray-600">{menu.deskripsi_menu}</p>
          <p className="text-md font-bold text-blue-600 mt-1">
            {formatRupiah(menu.harga_menu)}
          </p>
          <p className={`text-sm font-medium ${stokHabis ? 'text-red-600' : 'text-gray-500'} mt-1`}>
            {stokHabis ? 'Stok Habis' : `Stok: ${menu.stok_menu}`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            value={jumlah}
            onChange={(e) => setJumlah(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            min="1"
            max={menu.stok_menu}
            disabled={stokHabis || isPending}
          />
          <button
            onClick={handlePesan}
            disabled={stokHabis || isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isPending ? 'Memproses...' : 'Pesan'}
          </button>
        </div>
      </div>
    </li>
  );
}