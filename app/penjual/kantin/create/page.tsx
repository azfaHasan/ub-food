// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function BuatKantinPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     nama_kantin: '',
//     jam_buka: '',
//     jam_tutup: '',
//     deskripsi_kantin: '',
//     lokasi: '',
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const response = await fetch('/api/kantin', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.message || 'Gagal membuat kantin');
//       }

//       setSuccess('Kantin berhasil dibuat')
//       setTimeout(() => {
//           router.push(`/penjual`);
//       }, 2000)

//     } catch (error) {
//         if (error instanceof Error) {
//             setError(error.message);
//         }
//         else {
//             setError("An unknown error occurred");
//         }
//     } finally {
//         if (error) {
//             setIsLoading(false);
//         }
//     }
//   };

//   return (
//     <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
//       <h1>Buat Kantin Baru</h1>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '15px' }}>
//           <label>
//             Nama Kantin:
//             <input
//               type="text"
//               name="nama_kantin"
//               value={formData.nama_kantin}
//               onChange={handleChange}
//               required
//               style={{ width: '100%', padding: '8px' }}
//             />
//           </label>
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>
//             Jam Buka:
//             <input
//               type="time"
//               name="jam_buka"
//               value={formData.jam_buka}
//               onChange={handleChange}
//               style={{ width: '100%', padding: '8px' }}
//             />
//           </label>
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>
//             Jam Tutup:
//             <input
//               type="time"
//               name="jam_tutup"
//               value={formData.jam_tutup}
//               onChange={handleChange}
//               style={{ width: '100%', padding: '8px' }}
//             />
//           </label>
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>
//             Deskripsi:
//             <textarea
//               name="deskripsi_kantin"
//               value={formData.deskripsi_kantin}
//               onChange={handleChange}
//               style={{ width: '100%', padding: '8px', minHeight: '100px' }}
//             />
//           </label>
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>
//             Lokasi/Alamat:
//             <input
//               type="text"
//               name="lokasi"
//               value={formData.lokasi}
//               onChange={handleChange}
//               style={{ width: '100%', padding: '8px' }}
//             />
//           </label>
//         </div>
        
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         {success && <p style={{ color: 'green' }}>{success}</p>}
        
//         <button type="submit" disabled={isLoading} style={{ padding: '10px 20px' }}>
//           {isLoading ? 'Menyimpan...' : 'Simpan Kantin'}
//         </button>
//       </form>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Ditambahkan untuk breadcrumbs

// Komponen helper untuk 'spinner' pada tombol loading
function Spinner() {
  return (
    <svg 
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

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

    // Salin error ke variabel lokal untuk
    // digunakan di 'finally'
    let submitError = null;

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

      setSuccess('Kantin berhasil dibuat! Mengalihkan ke dashboard...');
      setTimeout(() => {
          router.push(`/penjual`);
      }, 2000);

    } catch (error) {
        if (error instanceof Error) {
          submitError = error.message;
          setError(error.message);
        }
        else {
          submitError = "An unknown error occurred";
          setError("An unknown error occurred");
        }
    } finally {
        // Hanya matikan loading jika ada error,
        // jika sukses, biarkan loading sampai redirect
        if (submitError) {
          setIsLoading(false);
        }
    }
  };

  // --- UI YANG DIDESAIN ULANG DIMULAI DI SINI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/penjual" className="text-slate-600 hover:text-purple-600 transition-colors font-medium">
              Dashboard
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 font-semibold">Buat Kantin Baru</span>
          </nav>
        </div>

        {/* Header Card */}
        <div className="mb-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                    {/* Ikon Toko/Kantin */}
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Buat Kantin Baru
                  </h1>
                  <p className="text-sm text-purple-100">
                    Isi formulir untuk mendaftarkan kantin baru Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Formulir Pendaftaran</h2>
                <p className="text-sm text-slate-600">Masukkan detail kantin Anda.</p>
              </div>
            </div>
          </div>

          {/* Card Body (Form) */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Nama Kantin */}
              <div>
                <label htmlFor="nama_kantin" className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Kantin
                </label>
                <input
                  type="text"
                  name="nama_kantin"
                  id="nama_kantin"
                  value={formData.nama_kantin}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  placeholder="Contoh: Kantin Berkah"
                />
              </div>

              {/* Jam Buka & Tutup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="jam_buka" className="block text-sm font-medium text-slate-700 mb-1">
                    Jam Buka
                  </label>
                  <input
                    type="time"
                    name="jam_buka"
                    id="jam_buka"
                    value={formData.jam_buka}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="jam_tutup" className="block text-sm font-medium text-slate-700 mb-1">
                    Jam Tutup
                  </label>
                  <input
                    type="time"
                    name="jam_tutup"
                    id="jam_tutup"
                    value={formData.jam_tutup}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label htmlFor="deskripsi_kantin" className="block text-sm font-medium text-slate-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  name="deskripsi_kantin"
                  id="deskripsi_kantin"
                  rows={4}
                  value={formData.deskripsi_kantin}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  placeholder="Jelaskan sedikit tentang kantin Anda..."
                />
              </div>

              {/* Lokasi */}
              <div>
                <label htmlFor="lokasi" className="block text-sm font-medium text-slate-700 mb-1">
                  Lokasi / Alamat
                </label>
                <input
                  type="text"
                  name="lokasi"
                  id="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  placeholder="Contoh: Gedung A, Lantai 2"
                />
              </div>
              
              {/* Pesan Error & Sukses */}
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}
              {success && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm font-medium text-green-700">{success}</p>
                </div>
              )}
              
              {/* Tombol Submit */}
              <div className="pt-5 border-t border-slate-200">
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full inline-flex justify-center items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {isLoading && <Spinner />}
                  {isLoading ? 'Menyimpan...' : 'Simpan dan Buat Kantin'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}