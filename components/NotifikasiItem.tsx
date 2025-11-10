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
      } else if (result.error) {
        alert(result.error);
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
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0" title="Belum dibaca"></div>
        )}
        
        <div className="flex-1">
          <p className={`font-medium ${!notif.status_baca ? 'text-gray-900' : 'text-gray-700'}`}>
            {notif.isi_pesan}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(notif.waktu_kirim).toLocaleString("id-ID", {
              day: 'numeric', 
              month: 'long', 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </p>
        </div>
        {notif.link_tujuan && (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        )}
      </div>
    </li>
  );
}