/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `languages` JSON NULL,
    ADD COLUMN `password` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `rejectionReason` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('DOCTOR', 'HOSPITAL', 'NURSE', 'PATIENT', 'ADMIN') NOT NULL,
    ADD COLUMN `verificationStatus` ENUM('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `email` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Caregiver` (
    `id` INTEGER NOT NULL,
    `bio` VARCHAR(191) NULL,
    `experienceYears` INTEGER NOT NULL DEFAULT 0,
    `hourlyRate` DOUBLE NULL,
    `dailyRate` DOUBLE NULL,
    `skills` JSON NULL,
    `travelRadiusKm` INTEGER NOT NULL DEFAULT 10,
    `backgroundCheckStatus` BOOLEAN NOT NULL DEFAULT false,
    `documents` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NurseSlot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nurseId` INTEGER NOT NULL,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NOT NULL,
    `slotType` ENUM('HOURLY', 'DAILY') NOT NULL,
    `maxHours` INTEGER NULL,
    `isRecurring` BOOLEAN NOT NULL DEFAULT false,
    `recurrence` JSON NULL,
    `locationZone` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaregiverBooking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `caregiverId` INTEGER NOT NULL,
    `requesterId` INTEGER NOT NULL,
    `dateFrom` DATETIME(3) NOT NULL,
    `dateTo` DATETIME(3) NOT NULL,
    `hours` INTEGER NULL,
    `status` ENUM('REQUESTED', 'RESERVED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'EXPIRED') NOT NULL DEFAULT 'REQUESTED',
    `totalAmount` DOUBLE NOT NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingTask` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `done` BOOLEAN NOT NULL DEFAULT false,
    `timestamp` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,
    `photoUrls` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Device` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` ENUM('MONITORING', 'RESPIRATORY', 'CARDIAC', 'PROCEDURE', 'ICU', 'NEONATAL', 'PHYSIO', 'ENDOSCOPY', 'DENTAL', 'IMAGING', 'INFRASTRUCTURE') NOT NULL,
    `condition` ENUM('GOOD', 'FAIR', 'POOR') NOT NULL DEFAULT 'GOOD',
    `dailyPrice` DOUBLE NOT NULL,
    `locationCity` VARCHAR(191) NOT NULL,
    `available` BOOLEAN NOT NULL DEFAULT true,
    `images` JSON NULL,
    `description` VARCHAR(191) NULL,
    `ownerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `targetType` VARCHAR(191) NOT NULL,
    `targetId` INTEGER NOT NULL,
    `raterId` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LedgerEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nurseId` INTEGER NULL,
    `deviceBookingId` INTEGER NULL,
    `caregiverBookingId` INTEGER NULL,
    `userId` INTEGER NULL,
    `type` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `meta` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `id` INTEGER NOT NULL,
    `specialization` VARCHAR(191) NULL,
    `experienceYears` INTEGER NULL,
    `qualifications` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `consultationFee` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER NOT NULL,
    `age` INTEGER NULL,
    `gender` VARCHAR(191) NULL,
    `bloodGroup` VARCHAR(191) NULL,
    `allergies` VARCHAR(191) NULL,
    `medicalHistory` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceBooking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `dateFrom` DATETIME(3) NOT NULL,
    `dateTo` DATETIME(3) NOT NULL,
    `status` ENUM('REQUESTED', 'RESERVED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'EXPIRED') NOT NULL DEFAULT 'REQUESTED',
    `totalPrice` DOUBLE NOT NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);

-- AddForeignKey
ALTER TABLE `Caregiver` ADD CONSTRAINT `Caregiver_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NurseSlot` ADD CONSTRAINT `NurseSlot_nurseId_fkey` FOREIGN KEY (`nurseId`) REFERENCES `Caregiver`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaregiverBooking` ADD CONSTRAINT `CaregiverBooking_caregiverId_fkey` FOREIGN KEY (`caregiverId`) REFERENCES `Caregiver`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaregiverBooking` ADD CONSTRAINT `CaregiverBooking_requesterId_fkey` FOREIGN KEY (`requesterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingTask` ADD CONSTRAINT `BookingTask_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `CaregiverBooking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_raterId_fkey` FOREIGN KEY (`raterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LedgerEntry` ADD CONSTRAINT `LedgerEntry_nurseId_fkey` FOREIGN KEY (`nurseId`) REFERENCES `Caregiver`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LedgerEntry` ADD CONSTRAINT `ledger_deviceBooking_fkey` FOREIGN KEY (`deviceBookingId`) REFERENCES `DeviceBooking`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LedgerEntry` ADD CONSTRAINT `ledger_caregiverBooking_fkey` FOREIGN KEY (`caregiverBookingId`) REFERENCES `CaregiverBooking`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LedgerEntry` ADD CONSTRAINT `LedgerEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeviceBooking` ADD CONSTRAINT `DeviceBooking_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeviceBooking` ADD CONSTRAINT `DeviceBooking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
