'use client';

import { useTransition } from 'react';
import { tandaiSemuaDibaca } from '@/actions/notifikasi';

export default function TandaiSemuaDibacaButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await tandaiSemuaDibaca();
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
    >
      {isPending ? 'Memproses...' : 'Tandai semua telah dibaca'}
    </button>
  );
}