'use client';

import { useTransition } from 'react';
import { hapusItemKeranjang } from '@/actions/keranjang';

interface HapusItemButtonProps {
  id_detail_keranjang: string;
}

export default function HapusItemButton({ id_detail_keranjang }: HapusItemButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (confirm('Anda yakin ingin menghapus item ini dari keranjang?')) {
      startTransition(async () => {
        const result = await hapusItemKeranjang(id_detail_keranjang);
        if (result?.error) {
          alert(result.error);
        }
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-sm font-medium text-red-600 hover:text-red-800 disabled:text-gray-400"
    >
      {isPending ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}