/*
  Warnings:

  - You are about to drop the column `image` on the `module` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `module` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `module` DROP COLUMN `image`,
    DROP COLUMN `url`;
