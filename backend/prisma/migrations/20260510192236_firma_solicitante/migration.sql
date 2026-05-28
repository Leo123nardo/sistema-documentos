-- AlterTable
ALTER TABLE `requisiciones` ADD COLUMN `firmadoEn` DATETIME(3) NULL,
    ADD COLUMN `firmadoPorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `requisiciones` ADD CONSTRAINT `requisiciones_firmadoPorId_fkey` FOREIGN KEY (`firmadoPorId`) REFERENCES `usuarios`(`ID_Usuario`) ON DELETE SET NULL ON UPDATE CASCADE;
