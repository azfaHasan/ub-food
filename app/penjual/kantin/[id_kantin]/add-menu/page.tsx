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
        body: JSON.stringify({ ...formData }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Gagal menambah menu');
      }

      setSuccess('Menu berhasil ditambahkan!');
      setTimeout(() => {
        router.push(`/penjual/kantin/${id_kantin}`);
      }, 2000);

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#EBF2FE' }}>
      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Back Button & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button 
            onClick={() => router.back()}
            style={{ 
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
          >
            <svg style={{ width: '28px', height: '28px', color: '#1F2937' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937', margin: 0 }}>
            Tambah Menu Baru
          </h1>
        </div>

        {/* Form Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '48px 56px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Nama Menu */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                color: '#1F2937', 
                fontWeight: '600', 
                marginBottom: '10px',
                fontSize: '15px'
              }}>
                Nama Menu <span style={{ color: '#1F2937' }}>*</span>
              </label>
              <input
                type="text"
                name="nama_menu"
                value={formData.nama_menu}
                onChange={handleChange}
                placeholder="Masukkan nama menu"
                required
                style={{ 
                  width: '100%', 
                  padding: '14px 16px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#6B7280',
                  backgroundColor: '#FAFAFA'
                }}
              />
            </div>

            {/* Harga & Stok */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '24px', 
              marginBottom: '32px' 
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  color: '#1F2937', 
                  fontWeight: '600', 
                  marginBottom: '10px',
                  fontSize: '15px'
                }}>
                  Harga Menu (Rp) <span style={{ color: '#1F2937' }}>*</span>
                </label>
                <input
                  type="number"
                  name="harga_menu"
                  value={formData.harga_menu}
                  onChange={handleChange}
                  placeholder="Rp"
                  required
                  min="0"
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#6B7280',
                    backgroundColor: '#FAFAFA'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  color: '#1F2937', 
                  fontWeight: '600', 
                  marginBottom: '10px',
                  fontSize: '15px'
                }}>
                  Stok Menu <span style={{ color: '#1F2937' }}>*</span>
                </label>
                <input
                  type="number"
                  name="stok_menu"
                  value={formData.stok_menu}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#6B7280',
                    backgroundColor: '#FAFAFA'
                  }}
                />
              </div>
            </div>

            {/* Deskripsi Menu */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                color: '#1F2937', 
                fontWeight: '600', 
                marginBottom: '10px',
                fontSize: '15px'
              }}>
                Deskripsi Menu
              </label>
              <textarea
                name="deskripsi_menu"
                value={formData.deskripsi_menu}
                onChange={handleChange}
                placeholder="Masukkan deskripsi menu"
                rows={4}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'none',
                  color: '#6B7280',
                  backgroundColor: '#FAFAFA',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Foto Menu */}
            <div style={{ marginBottom: '40px' }}>
              <label style={{ 
                display: 'block', 
                color: '#1F2937', 
                fontWeight: '600', 
                marginBottom: '10px',
                fontSize: '15px'
              }}>
                Foto Menu
              </label>
              <div style={{ 
                border: '2px dashed #D1D5DB',
                borderRadius: '8px',
                padding: '60px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: '#FAFAFA'
              }}>
                <svg style={{ width: '40px', height: '40px', color: '#9CA3AF', margin: '0 auto 12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
                  Klik untuk unggah foto menu
                </p>
              </div>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div style={{ 
                marginBottom: '24px', 
                padding: '16px', 
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#B91C1C',
                borderRadius: '8px'
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ 
                marginBottom: '24px', 
                padding: '16px', 
                background: '#F0FDF4',
                border: '1px solid #86EFAC',
                color: '#15803D',
                borderRadius: '8px'
              }}>
                {success}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{ 
                  flex: 1,
                  background: isLoading ? '#93B8F5' : '#3B81F4',
                  color: 'white',
                  fontWeight: '600',
                  padding: '14px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '15px'
                }}
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Menu'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                style={{ 
                  padding: '14px 40px',
                  background: '#E5E7EB',
                  color: '#374151',
                  fontWeight: '600',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                  fontSize: '15px'
                }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}