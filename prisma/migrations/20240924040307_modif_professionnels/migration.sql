/*
  Warnings:

  - Added the required column `image` to the `Professionnel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Professionnel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `professionnel` ADD COLUMN `image` VARCHAR(191) NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;
