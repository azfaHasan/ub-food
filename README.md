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

## Cloning Repository

Bikin folder baru dengan nama ub-food atau yang lain.

Copy path folder yang udah dibuat di terminal.

```bash
cd alamat folder kalian
# misalnya cd C:\Users\NamaAnda\Projects
```

Jalankan ini di Git Bash dalam folder terkait untuk cloning.
```bash
git clone [URL_REPOSITORY_ANDA_DI_SINI]
```

Pada GitHub desktop akses menu `file` -> `add local repository` -> pilih folder kalian yang sudah dibuat.

Buat branch baru untuk workbench teman-teman.

## Selesai Cloning

Jalankan ini di terminal untuk install semua dependency.

```bash
npm install
```

Jalankan ini untuk generate secret.

```bash
npx auth secret
```

Jalankan ini untuk generate key

## Keperluan Database

Jalankan server MySQL (Laragon atau XAMPP).

Buat koneksi baru dan database baru misalnya `dbSaya`

Copy file `.env.example`, dan ubah nama file copynya menjadi `.env`, kemudian isi data database teman-teman.

Jalankan ini untuk membuat semua tabel di database.

```bash
npm prisma migrate dev
```

Jika migrate tidak bisa dijalankan bisa hapus folder `node_modules` dan file `package-lock.json`, kemudian jalankan lagi command ini.

```bash
npm install
```

## Menjalankan dan Mematikan Projek

Untuk menjalankan projek bisa menggunakan command ini.

```bash
npm run dev
```

Kemudian untuk menghentikan projek bisa interupsi terminal dengan `Ctrl + C` atau lainnya.
