-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_flashcard_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `flashcardId` INTEGER NOT NULL,
    `status` ENUM('NOT_LEARNED', 'LEARNING', 'REVIEW', 'MASTERED') NOT NULL DEFAULT 'NOT_LEARNED',
    `lastReviewedAt` DATETIME(3) NULL,
    `nextReviewDue` DATETIME(3) NULL,
    `reviewCount` INTEGER NOT NULL DEFAULT 0,
    `easeFactor` DOUBLE NOT NULL DEFAULT 2.5,
    `interval` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_flashcard_status_userId_flashcardId_key`(`userId`, `flashcardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_flashcard_status` ADD CONSTRAINT `user_flashcard_status_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_flashcard_status` ADD CONSTRAINT `user_flashcard_status_flashcardId_fkey` FOREIGN KEY (`flashcardId`) REFERENCES `FlashCard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
