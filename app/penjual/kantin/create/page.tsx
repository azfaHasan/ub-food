'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BuatKantinPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_kantin: '',
    jam_buka: '',
    jam_tutup: '',
    deskripsi_kantin: '',
    lokasi: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/kantin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Gagal membuat kantin');
      }

      setSuccess('Kantin berhasil dibuat')
      setTimeout(() => {
          router.push(`/penjual`);
      }, 2000)

    } catch (error) {
        if (error instanceof Error) {
            setError(error.message);
        }
        else {
            setError("An unknown error occurred");
        }
    } finally {
        if (error) {
            setIsLoading(false);
        }
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Buat Kantin Baru</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Nama Kantin:
            <input
              type="text"
              name="nama_kantin"
              value={formData.nama_kantin}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Jam Buka:
            <input
              type="time"
              name="jam_buka"
              value={formData.jam_buka}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Jam Tutup:
            <input
              type="time"
              name="jam_tutup"
              value={formData.jam_tutup}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Deskripsi:
            <textarea
              name="deskripsi_kantin"
              value={formData.deskripsi_kantin}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', minHeight: '100px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Lokasi/Alamat:
            <input
              type="text"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </label>
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        
        <button type="submit" disabled={isLoading} style={{ padding: '10px 20px' }}>
          {isLoading ? 'Menyimpan...' : 'Simpan Kantin'}
        </button>
      </form>
    </div>
  );
}