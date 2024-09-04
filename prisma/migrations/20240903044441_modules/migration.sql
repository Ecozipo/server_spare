/*
  Warnings:

  - Added the required column `image` to the `Fournisseur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Fournisseur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fournisseur` ADD COLUMN `image` VARCHAR(191) NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `TypeModule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Module` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `type` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `utilisateur` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Module` ADD CONSTRAINT `Module_utilisateur_fkey` FOREIGN KEY (`utilisateur`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Module` ADD CONSTRAINT `Module_type_fkey` FOREIGN KEY (`type`) REFERENCES `TypeModule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
