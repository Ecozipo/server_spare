/*
  Warnings:

  - You are about to drop the column `utilisateur` on the `consomation` table. All the data in the column will be lost.
  - You are about to drop the column `utilisateur` on the `notifications` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `consomation` DROP FOREIGN KEY `Consomation_utilisateur_fkey`;

-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `Notifications_utilisateur_fkey`;

-- AlterTable
ALTER TABLE `consomation` DROP COLUMN `utilisateur`,
    MODIFY `valeur` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `utilisateur`;
