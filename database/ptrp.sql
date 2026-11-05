CREATE DATABASE IF NOT EXISTS `ptrp`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `ptrp`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(320) DEFAULT NULL,
  `passwordHash` varchar(255) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `resetToken` varchar(128) DEFAULT NULL,
  `resetTokenExpires` datetime DEFAULT NULL,
  `openId` varchar(64) DEFAULT NULL,
  `loginMethod` varchar(64) DEFAULT 'local',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_openId_unique` (`openId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migration helpers for upgrading existing installations without data loss
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `passwordHash` varchar(255) DEFAULT NULL AFTER `email`;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `resetToken` varchar(128) DEFAULT NULL AFTER `role`;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `resetTokenExpires` datetime DEFAULT NULL AFTER `resetToken`;
ALTER TABLE `users` MODIFY COLUMN `openId` varchar(64) NULL;

CREATE TABLE IF NOT EXISTS `siteContent` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) NOT NULL,
  `title` varchar(255) NOT NULL,
  `summary` text DEFAULT NULL,
  `body` text NOT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `updatedBy` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `siteContent_slug_unique` (`slug`),
  KEY `siteContent_updatedBy_idx` (`updatedBy`),
  CONSTRAINT `siteContent_updatedBy_fk` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mediaAssets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `storageKey` varchar(500) NOT NULL,
  `url` varchar(700) NOT NULL,
  `mimeType` varchar(120) NOT NULL,
  `size` int NOT NULL,
  `altText` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','archived') NOT NULL DEFAULT 'approved',
  `uploadedBy` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mediaAssets_storageKey_unique` (`storageKey`),
  KEY `mediaAssets_uploadedBy_idx` (`uploadedBy`),
  CONSTRAINT `mediaAssets_uploadedBy_fk` FOREIGN KEY (`uploadedBy`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `schools` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `district` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(700) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'published',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `schools_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(320) DEFAULT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `schoolId` int DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `photoUrl` varchar(700) DEFAULT NULL,
  `status` enum('pending','approved','inactive') NOT NULL DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `teachers_schoolId_idx` (`schoolId`),
  CONSTRAINT `teachers_schoolId_fk` FOREIGN KEY (`schoolId`) REFERENCES `schools` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `alumni` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(320) DEFAULT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `graduationYear` int DEFAULT NULL,
  `schoolId` int DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `alumni_schoolId_idx` (`schoolId`),
  CONSTRAINT `alumni_schoolId_fk` FOREIGN KEY (`schoolId`) REFERENCES `schools` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `newsArticles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(80) NOT NULL DEFAULT 'Announcements',
  `excerpt` text DEFAULT NULL,
  `body` text NOT NULL,
  `imageUrl` varchar(700) DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `publishedAt` timestamp NULL DEFAULT NULL,
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `newsArticles_slug_unique` (`slug`),
  KEY `newsArticles_createdBy_idx` (`createdBy`),
  CONSTRAINT `newsArticles_createdBy_fk` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `galleryItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `caption` text DEFAULT NULL,
  `url` varchar(700) NOT NULL,
  `mediaType` enum('image','video') NOT NULL DEFAULT 'image',
  `category` varchar(80) DEFAULT NULL,
  `status` enum('pending','approved','archived') NOT NULL DEFAULT 'approved',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `galleryItems_createdBy_idx` (`createdBy`),
  CONSTRAINT `galleryItems_createdBy_fk` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bestPractices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `category` varchar(80) NOT NULL DEFAULT 'Teaching practice',
  `summary` text DEFAULT NULL,
  `body` text NOT NULL,
  `documentUrl` varchar(700) DEFAULT NULL,
  `imageUrl` varchar(700) DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
