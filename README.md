## Persiapan

Install [node.js](https://nodejs.org/en/download) pilih versi yang LTS untuk Windows Installer. Untuk npm nanti sekalian terinstall.

Pada proses install jangan lupa bagian PATH juga dinyalakan.

```bash
node -v
# untuk cek node apakah sudah terinstall

npm -v
# untuk cek apakah npm sudah terinstall 
```

Jalankan kedua command di cmd admin atau terminal VScode.

## Selesai Install

Jalankan ini di terminal untuk install semua dependency.

```bash
npm install
```

## Keperluan Database

Jalankan server MySQL (Laragon atau XAMPP).

Buat koneksi baru dan database baru misalnya `dbSaya`

Ubah isi file `.env.example`, dan ubah namanya menjadi `.env`

Jalankan ini untuk membuat semua tabel di database.

```bash
npm prisma migrate dev
```

## Menjalankan dan Mematikan Projek

Untuk menjalankan projek bisa menggunakan command ini.

```bash
npm run dev
```

Kemudian untuk menghentikan projek bisa interupsi terminal dengan `Ctrl + C` atau lainnya.