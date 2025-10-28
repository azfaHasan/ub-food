'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function TambahMenuPage() {
  const router = useRouter();
  const params = useParams();
  const id_kantin = params.id_kantin as string;

  const [formData, setFormData] = useState({
    nama_menu: '',
    harga_menu: '',
    deskripsi_menu: '',
    stok_menu: '0',
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

    try {
      const response = await fetch(`/api/kantin/${id_kantin}/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Gagal menambah menu');
      }

      setSuccess('Menu berhasil ditambahkan!');
      setTimeout(() => {
          router.push(`/penjual/kantin/${id_kantin}`); 
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
      <h1>Tambah Menu Baru</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Nama Menu:
            <input
              type="text"
              name="nama_menu"
              value={formData.nama_menu}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Harga (Rupiah):
            <input
              type="number"
              name="harga_menu"
              value={formData.harga_menu}
              onChange={handleChange}
              required
              min="0"
              style={{ width: '100%', padding: '8px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Stok Menu:
            <input
              type="number"
              name="stok_menu"
              value={formData.stok_menu}
              onChange={handleChange}
              min="0"
              style={{ width: '100%', padding: '8px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Deskripsi Menu:
            <textarea
              name="deskripsi_menu"
              value={formData.deskripsi_menu}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', minHeight: '100px' }}
            />
          </label>
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        
        <button type="submit" disabled={isLoading} style={{ padding: '10px 20px' }}>
          {isLoading ? 'Menyimpan...' : 'Simpan Menu'}
        </button>
      </form>
    </div>
  );
}