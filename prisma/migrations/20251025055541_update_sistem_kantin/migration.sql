-- CreateTable
CREATE TABLE `Kantin` (
    `id_kantin` VARCHAR(191) NOT NULL,
    `id_penjual` VARCHAR(191) NOT NULL,
    `nama_kantin` VARCHAR(191) NOT NULL,
    `jam_buka` TIME NULL,
    `jam_tutup` TIME NULL,
    `deskripsi_kantin` TEXT NULL,
    `foto_kantin` VARCHAR(191) NULL,
    `lokasi` VARCHAR(191) NULL,

    PRIMARY KEY (`id_kantin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Menu` (
    `id_menu` VARCHAR(191) NOT NULL,
    `id_kantin` VARCHAR(191) NOT NULL,
    `nama_menu` VARCHAR(191) NOT NULL,
    `deskripsi_menu` TEXT NULL,
    `harga_menu` DOUBLE NOT NULL,
    `foto_menu` VARCHAR(191) NULL,
    `stok_menu` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id_menu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Kantin` ADD CONSTRAINT `Kantin_id_penjual_fkey` FOREIGN KEY (`id_penjual`) REFERENCES `Penjual`(`id_penjual`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Menu` ADD CONSTRAINT `Menu_id_kantin_fkey` FOREIGN KEY (`id_kantin`) REFERENCES `Kantin`(`id_kantin`) ON DELETE CASCADE ON UPDATE CASCADE;
