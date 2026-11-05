-- Back up the ptrp database before applying this additive CMS migration.
-- Existing content tables are retained; page records continue to use siteContent.

ALTER TABLE `siteContent` MODIFY COLUMN `body` mediumtext NOT NULL;

CREATE TABLE IF NOT EXISTS `websiteSettings` (
  `settingKey` varchar(100) NOT NULL,
  `settingValue` longtext NOT NULL,
  `updatedBy` int DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`settingKey`),
  KEY `websiteSettings_updatedBy_idx` (`updatedBy`),
  CONSTRAINT `websiteSettings_updatedBy_fk` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `navigationItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(120) NOT NULL,
  `href` varchar(500) NOT NULL,
  `parentId` int DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  `isVisible` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('draft','published') NOT NULL DEFAULT 'published',
  `updatedBy` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `navigationItems_parentId_idx` (`parentId`),
  KEY `navigationItems_published_idx` (`status`,`isVisible`,`sortOrder`),
  UNIQUE KEY `navigationItems_href_unique` (`href`),
  CONSTRAINT `navigationItems_parentId_fk` FOREIGN KEY (`parentId`) REFERENCES `navigationItems` (`id`) ON DELETE CASCADE,
  CONSTRAINT `navigationItems_updatedBy_fk` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `navigationItems` (`label`, `href`, `sortOrder`, `isVisible`, `status`) VALUES
  ('Home', '/', 1, 1, 'published'),
  ('About', '/about', 2, 1, 'published'),
  ('Model Schools', '/network', 3, 1, 'published'),
  ('Impact', '/impact', 4, 1, 'published'),
  ('News & Activities', '/news', 5, 1, 'published'),
  ('Gallery', '/gallery', 6, 1, 'published'),
  ('Alumni', '/alumni', 7, 1, 'published'),
  ('Resident Teachers', '/residents', 8, 1, 'published'),
  ('Program Team', '/team', 9, 1, 'published'),
  ('Resources', '/resources', 10, 1, 'published'),
  ('Partners', '/partners', 11, 1, 'published'),
  ('Join & Contact', '/contact', 12, 1, 'published');

INSERT IGNORE INTO `websiteSettings` (`settingKey`, `settingValue`) VALUES
  ('siteName', 'PTR Alumni Network'),
  ('tagline', 'Inspire, Educate and Empower.'),
  ('contactEmail', 'info@ptr.rw'),
  ('primaryColor', '#0b2347'),
  ('accentColor', '#0098d9');
