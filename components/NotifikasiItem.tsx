'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { tandaiSudahDibaca } from '@/actions/notifikasi';
import { Notifikasi } from '@prisma/client';

export default function NotifikasiItem({ notif }: { notif: Notifikasi }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      const result = await tandaiSudahDibaca(notif.id_notifikasi);
      if (result.success && result.link) {
        router.push(result.link);
      } else if (result.success) {
        router.push('/');
      }
    });
  };

  return (
    <li
      onClick={handleClick}
      className={`p-4 rounded-lg cursor-pointer transition-colors ${
        notif.status_baca 
          ? 'bg-white hover:bg-gray-50' 
          : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
      } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
    >
      <div className="flex items-center space-x-3">
        {!notif.status_baca && (
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0"></div>
        )}
        <div className="flex-1">
          <p className={`font-medium ${!notif.status_baca ? 'text-gray-900' : 'text-gray-700'}`}>
            {notif.isi_pesan}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(notif.waktu_kirim).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </li>
  );
}