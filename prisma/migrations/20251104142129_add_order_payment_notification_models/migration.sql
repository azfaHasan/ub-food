-- CreateTable
CREATE TABLE `Keranjang` (
    `id_keranjang` VARCHAR(191) NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Keranjang_id_user_key`(`id_user`),
    PRIMARY KEY (`id_keranjang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailKeranjang` (
    `id_detail_keranjang` VARCHAR(191) NOT NULL,
    `id_keranjang` VARCHAR(191) NOT NULL,
    `id_menu` VARCHAR(191) NOT NULL,
    `jumlah` INTEGER NOT NULL,

    UNIQUE INDEX `DetailKeranjang_id_keranjang_id_menu_key`(`id_keranjang`, `id_menu`),
    PRIMARY KEY (`id_detail_keranjang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pemesanan` (
    `id_pemesanan` VARCHAR(191) NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,
    `id_kantin` VARCHAR(191) NOT NULL,
    `deskripsi_pemesanan` TEXT NULL,
    `tanggal_pemesanan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status_pemesanan` ENUM('PENDING', 'DIPROSES', 'SIAP_DIAMBIL', 'SELESAI', 'DIBATALKAN') NOT NULL DEFAULT 'PENDING',
    `total_harga` DOUBLE NOT NULL,
    `nomor_antrean` INTEGER NOT NULL,
    `metode_pembayaran` ENUM('TUNAI', 'QRIS', 'SALDO_APP') NOT NULL,
    `status_pembayaran` ENUM('PENDING', 'LUNAS', 'GAGAL') NOT NULL DEFAULT 'PENDING',
    `tanggal_pembayaran` DATETIME(3) NULL,

    INDEX `Pemesanan_id_kantin_idx`(`id_kantin`),
    INDEX `Pemesanan_id_user_idx`(`id_user`),
    PRIMARY KEY (`id_pemesanan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailPemesanan` (
    `id_detail` VARCHAR(191) NOT NULL,
    `id_pemesanan` VARCHAR(191) NOT NULL,
    `id_menu` VARCHAR(191) NOT NULL,
    `jumlah_menu` INTEGER NOT NULL,
    `harga_satuan` DOUBLE NOT NULL,

    PRIMARY KEY (`id_detail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifikasi` (
    `id_notifikasi` VARCHAR(191) NOT NULL,
    `id_akun_tujuan` VARCHAR(191) NOT NULL,
    `tipe_notifikasi` ENUM('PESANAN_BARU', 'STATUS_UPDATE', 'PEMBAYARAN', 'UMUM') NOT NULL,
    `isi_pesan` TEXT NOT NULL,
    `link_tujuan` VARCHAR(191) NULL,
    `status_baca` BOOLEAN NOT NULL DEFAULT false,
    `waktu_kirim` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notifikasi_id_akun_tujuan_idx`(`id_akun_tujuan`),
    PRIMARY KEY (`id_notifikasi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Keranjang` ADD CONSTRAINT `Keranjang_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailKeranjang` ADD CONSTRAINT `DetailKeranjang_id_keranjang_fkey` FOREIGN KEY (`id_keranjang`) REFERENCES `Keranjang`(`id_keranjang`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailKeranjang` ADD CONSTRAINT `DetailKeranjang_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `Menu`(`id_menu`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pemesanan` ADD CONSTRAINT `Pemesanan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pemesanan` ADD CONSTRAINT `Pemesanan_id_kantin_fkey` FOREIGN KEY (`id_kantin`) REFERENCES `Kantin`(`id_kantin`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPemesanan` ADD CONSTRAINT `DetailPemesanan_id_pemesanan_fkey` FOREIGN KEY (`id_pemesanan`) REFERENCES `Pemesanan`(`id_pemesanan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPemesanan` ADD CONSTRAINT `DetailPemesanan_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `Menu`(`id_menu`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifikasi` ADD CONSTRAINT `Notifikasi_id_akun_tujuan_fkey` FOREIGN KEY (`id_akun_tujuan`) REFERENCES `Akun`(`id_akun`) ON DELETE CASCADE ON UPDATE CASCADE;
