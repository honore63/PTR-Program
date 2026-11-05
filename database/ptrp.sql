CREATE DATABASE IF NOT EXISTS `ptrp`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `ptrp`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `openId` varchar(64) NOT NULL,
  `name` text DEFAULT NULL,
  `email` varchar(320) DEFAULT NULL,
  `loginMethod` varchar(64) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_openId_unique` (`openId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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