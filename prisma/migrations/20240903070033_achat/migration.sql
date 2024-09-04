/*
  Warnings:

  - Added the required column `prix` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `TypeModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `TypeModule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `module` ADD COLUMN `prix` INTEGER NOT NULL,
    ADD COLUMN `reference` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `typemodule` ADD COLUMN `image` VARCHAR(191) NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Achat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateur` INTEGER NOT NULL,
    `module` INTEGER NOT NULL,
    `payedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Achat` ADD CONSTRAINT `Achat_utilisateur_fkey` FOREIGN KEY (`utilisateur`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Achat` ADD CONSTRAINT `Achat_module_fkey` FOREIGN KEY (`module`) REFERENCES `Module`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
