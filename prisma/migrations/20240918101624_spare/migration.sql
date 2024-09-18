-- DropIndex
DROP INDEX `Achat_module_fkey` ON `achat`;

-- DropIndex
DROP INDEX `Achat_utilisateur_fkey` ON `achat`;

-- DropIndex
DROP INDEX `Consomation_utilisateur_fkey` ON `consomation`;

-- DropIndex
DROP INDEX `Module_type_fkey` ON `module`;

-- DropIndex
DROP INDEX `Notifications_utilisateur_fkey` ON `notifications`;

-- DropIndex
DROP INDEX `Professionnel_quartier_fkey` ON `professionnel`;

-- DropIndex
DROP INDEX `Professionnel_type_pro_fkey` ON `professionnel`;

-- DropIndex
DROP INDEX `Utilisateur_quartier_fkey` ON `utilisateur`;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_quartier_fkey` FOREIGN KEY (`quartier`) REFERENCES `Quartier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Professionnel` ADD CONSTRAINT `Professionnel_quartier_fkey` FOREIGN KEY (`quartier`) REFERENCES `Quartier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Professionnel` ADD CONSTRAINT `Professionnel_type_pro_fkey` FOREIGN KEY (`type_pro`) REFERENCES `TypeProfessionnel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Module` ADD CONSTRAINT `Module_type_fkey` FOREIGN KEY (`type`) REFERENCES `TypeModule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Achat` ADD CONSTRAINT `Achat_utilisateur_fkey` FOREIGN KEY (`utilisateur`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Achat` ADD CONSTRAINT `Achat_module_fkey` FOREIGN KEY (`module`) REFERENCES `Module`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consomation` ADD CONSTRAINT `Consomation_utilisateur_fkey` FOREIGN KEY (`utilisateur`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_utilisateur_fkey` FOREIGN KEY (`utilisateur`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
