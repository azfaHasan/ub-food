-- CreateTable
CREATE TABLE `Akun` (
    `id_akun` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `foto_akun` VARCHAR(191) NULL,
    `role` ENUM('USER', 'PENJUAL', 'ADMIN') NOT NULL,
    `tanggal_bergabung` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Akun_username_key`(`username`),
    UNIQUE INDEX `Akun_email_key`(`email`),
    PRIMARY KEY (`id_akun`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id_user` VARCHAR(191) NOT NULL,
    `id_akun` VARCHAR(191) NOT NULL,
    `no_hp_user` VARCHAR(191) NOT NULL,
    `nama_user` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_id_akun_key`(`id_akun`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Penjual` (
    `id_penjual` VARCHAR(191) NOT NULL,
    `id_akun` VARCHAR(191) NOT NULL,
    `no_hp_penjual` VARCHAR(191) NOT NULL,
    `nama_penjual` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Penjual_id_akun_key`(`id_akun`),
    PRIMARY KEY (`id_penjual`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id_admin` VARCHAR(191) NOT NULL,
    `id_akun` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admin_id_akun_key`(`id_akun`),
    PRIMARY KEY (`id_admin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `Akun`(`id_akun`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Penjual` ADD CONSTRAINT `Penjual_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `Akun`(`id_akun`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `Akun`(`id_akun`) ON DELETE CASCADE ON UPDATE CASCADE;
