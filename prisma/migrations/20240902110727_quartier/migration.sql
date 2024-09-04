/*
  Warnings:

  - Added the required column `quartier` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `utilisateur` ADD COLUMN `quartier` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `TypeProfessionnel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quartier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quartier` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Professionnel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `mail` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `quartier` INTEGER NOT NULL,
    `type_pro` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fournisseur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `quartier` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_quartier_fkey` FOREIGN KEY (`quartier`) REFERENCES `Quartier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Professionnel` ADD CONSTRAINT `Professionnel_quartier_fkey` FOREIGN KEY (`quartier`) REFERENCES `Quartier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Professionnel` ADD CONSTRAINT `Professionnel_type_pro_fkey` FOREIGN KEY (`type_pro`) REFERENCES `TypeProfessionnel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
