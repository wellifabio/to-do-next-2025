-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tarefa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `descricao` TEXT NOT NULL,
    `setor` VARCHAR(50) NOT NULL,
    `prioridade` ENUM('baixa', 'media', 'alta') NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('afazer', 'fazendo', 'pronto') NOT NULL DEFAULT 'afazer',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tarefa` ADD CONSTRAINT `Tarefa_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
