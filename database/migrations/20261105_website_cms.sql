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

CREATE TABLE IF NOT EXISTS `pageBanners` (
  `slug` varchar(80) NOT NULL,
  `eyebrow` varchar(120) NOT NULL DEFAULT '',
  `title` varchar(255) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `imageUrl` varchar(700) NOT NULL DEFAULT '',
  `imageAlt` varchar(255) NOT NULL DEFAULT '',
  `imagePosition` varchar(24) NOT NULL DEFAULT 'center',
  `isVisible` tinyint(1) NOT NULL DEFAULT 1,
  `updatedBy` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`slug`),
  KEY `pageBanners_updatedBy_idx` (`updatedBy`),
  CONSTRAINT `pageBanners_updatedBy_fk` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL
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
  ('primaryColor', '#0b2347'),
  ('accentColor', '#0098d9');

INSERT INTO `schools` (`name`, `district`, `description`, `latitude`, `longitude`, `status`)
SELECT school.`name`, school.`district`, school.`description`, school.`latitude`, school.`longitude`, 'published'
FROM (
  SELECT 'GS Matimba' AS `name`, 'Nyagatare' AS `district`, NULL AS `description`, -1.1192116 AS `latitude`, 30.4293638 AS `longitude`
  UNION ALL SELECT 'GS Jean de la Mennais Kirambo', 'Burera', NULL, -1.5078282, 29.8432030
  UNION ALL SELECT 'GS Byumba Catholique', 'Gicumbi', NULL, -1.5739545, 30.0547538
  UNION ALL SELECT 'GS Bihinga', 'Gatsibo', NULL, -1.6119493, 30.3823329
  UNION ALL SELECT 'GS Akanzu', 'Rwamagana', NULL, -2.0310475, 30.3336315
  UNION ALL SELECT 'Rukara Model School', 'Kayonza', NULL, -1.8007845, 30.5034396
  UNION ALL SELECT 'GS Zaza A', 'Ngoma', NULL, -2.1547942, 30.4303954
  UNION ALL SELECT 'GS Mayange A', 'Bugesera', NULL, -2.1857909, 30.0958743
  UNION ALL SELECT 'GS St Jean Paul II', 'Gisagara', 'Recently called ES Save', -2.6529852, 29.8352303
  UNION ALL SELECT 'GS St Laurent Cyahinda', 'Nyaruguru', NULL, -2.7426028, 29.6127451
  UNION ALL SELECT 'GS Mururu', 'Rusizi', NULL, -2.5067736, 28.8952211
  UNION ALL SELECT 'GS Uwinkomo', 'Nyamagabe', NULL, -2.5028998, 29.4770416
  UNION ALL SELECT 'GS Rubengera I', 'Karongi', NULL, -2.0424556, 29.4126085
  UNION ALL SELECT 'GS Muramba B', 'Ngororero', NULL, -1.7638062, 29.6151639
  UNION ALL SELECT 'GS St Etienne', 'Muhanga', NULL, -2.1299460, 29.7774184
  UNION ALL SELECT 'G.S Umubano I', 'Rubavu', NULL, -1.6819550, 29.2537440
  UNION ALL SELECT 'GS Nyarusange', 'Rwamagana', 'Google Maps identifies Nyarusange Secondary School in Rwamagana; confirm this is the PTRP school.', -1.9335036, 30.4529740
) AS school
WHERE NOT EXISTS (SELECT 1 FROM `schools` existing WHERE existing.`name` = school.`name`);

CREATE TABLE IF NOT EXISTS `coordinators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `organization` varchar(255) NOT NULL,
  `email` varchar(320) DEFAULT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `photoUrl` varchar(700) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `displayOrder` int NOT NULL DEFAULT 0,
  `isVisible` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('draft','published') NOT NULL DEFAULT 'published',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `coordinators_organization_idx` (`organization`),
  KEY `coordinators_status_idx` (`status`),
  KEY `coordinators_displayOrder_idx` (`displayOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mentors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `organization` varchar(255) NOT NULL,
  `email` varchar(320) DEFAULT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `photoUrl` varchar(700) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `displayOrder` int NOT NULL DEFAULT 0,
  `isVisible` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `mentors_organization_idx` (`organization`),
  KEY `mentors_status_idx` (`status`),
  KEY `mentors_displayOrder_idx` (`displayOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `coordinators` (`fullName`, `organization`, `email`, `phone`, `responsibilities`, `displayOrder`, `isVisible`, `status`)
SELECT 'Br. BIZIYAREMYE Ferdinand', 'TTC De La Salle Byumba', NULL, '+250 789 139 618', 'Coordinator of PTRP', 1, 1, 'published'
WHERE NOT EXISTS (
  SELECT 1 FROM `coordinators`
  WHERE `fullName` = 'Br. BIZIYAREMYE Ferdinand' AND `organization` = 'TTC De La Salle Byumba'
);

INSERT INTO `coordinators` (`fullName`, `organization`, `email`, `phone`, `responsibilities`, `displayOrder`, `isVisible`, `status`)
SELECT 'Br. Elias Nshimiyimana', 'SAVE', 'nshimiyimanaelias52@gmail.com', '+250 781 418 869', 'Coordinator of PTRP', 2, 1, 'published'
WHERE NOT EXISTS (
  SELECT 1 FROM `coordinators`
  WHERE `fullName` = 'Br. Elias Nshimiyimana' AND `organization` = 'SAVE'
);

INSERT INTO `mentors` (`fullName`, `organization`, `bio`, `responsibilities`, `displayOrder`, `isVisible`, `status`)
SELECT '[Mentor Name - De La Salle]', 'De La Salle',
  'Program mentor for resident teachers at De La Salle. Contact details and biography to be completed by the program administrator.',
  'Mentor resident teachers during guided classroom practice.', 1, 1, 'draft'
WHERE NOT EXISTS (
  SELECT 1 FROM `mentors` WHERE `organization` = 'De La Salle' AND `displayOrder` = 1
);

INSERT INTO `mentors` (`fullName`, `organization`, `bio`, `responsibilities`, `displayOrder`, `isVisible`, `status`)
SELECT '[Mentor Name - De La Salle]', 'De La Salle',
  'Program mentor for resident teachers at De La Salle. Contact details and biography to be completed by the program administrator.',
  'Mentor resident teachers during guided classroom practice.', 2, 1, 'draft'
WHERE NOT EXISTS (
  SELECT 1 FROM `mentors` WHERE `organization` = 'De La Salle' AND `displayOrder` = 2
);

INSERT INTO `mentors` (`fullName`, `organization`, `bio`, `responsibilities`, `displayOrder`, `isVisible`, `status`)
SELECT '[Mentor Name - SAVE]', 'SAVE',
  'Program mentor for resident teachers at SAVE. Contact details and biography to be completed by the program administrator.',
  'Mentor resident teachers during guided classroom practice.', 1, 1, 'draft'
WHERE NOT EXISTS (
  SELECT 1 FROM `mentors` WHERE `organization` = 'SAVE' AND `displayOrder` = 1
);

INSERT INTO `mentors` (`fullName`, `organization`, `bio`, `responsibilities`, `displayOrder`, `isVisible`, `status`)
SELECT '[Mentor Name - SAVE]', 'SAVE',
  'Program mentor for resident teachers at SAVE. Contact details and biography to be completed by the program administrator.',
  'Mentor resident teachers during guided classroom practice.', 2, 1, 'draft'
WHERE NOT EXISTS (
  SELECT 1 FROM `mentors` WHERE `organization` = 'SAVE' AND `displayOrder` = 2
);

CREATE TABLE IF NOT EXISTS `resident_teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(320) NOT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `gender` enum('male','female','other','prefer_not_to_say') DEFAULT NULL,
  `modelSchool` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `bestPractice` varchar(255) DEFAULT NULL,
  `bestPracticeDescription` text DEFAULT NULL,
  `subjects` text DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `contributions` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `photoUrl` varchar(700) DEFAULT NULL,
  `status` enum('pending','approved','published','rejected','unpublished') NOT NULL DEFAULT 'pending',
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `displayOrder` int NOT NULL DEFAULT 0,
  `submittedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewedAt` timestamp NULL DEFAULT NULL,
  `reviewedBy` int DEFAULT NULL,
  `publishedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `resident_teachers_email_unique` (`email`),
  KEY `resident_teachers_status_idx` (`status`),
  KEY `resident_teachers_modelSchool_idx` (`modelSchool`),
  KEY `resident_teachers_bestPractice_idx` (`bestPractice`),
  KEY `resident_teachers_isFeatured_idx` (`isFeatured`),
  KEY `resident_teachers_displayOrder_idx` (`displayOrder`),
  CONSTRAINT `resident_teachers_reviewedBy_fk` FOREIGN KEY (`reviewedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `resident_best_practices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacherId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(120) NOT NULL,
  `description` text NOT NULL,
  `mediaUrl` varchar(700) DEFAULT NULL,
  `mediaType` enum('image','video','document') DEFAULT NULL,
  `publishedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `resident_best_practices_teacherId_idx` (`teacherId`),
  KEY `resident_best_practices_category_idx` (`category`),
  CONSTRAINT `resident_best_practices_teacherId_fk` FOREIGN KEY (`teacherId`) REFERENCES `resident_teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `admin_activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `adminId` int NOT NULL,
  `action` varchar(120) NOT NULL,
  `entityType` varchar(80) NOT NULL,
  `entityId` int DEFAULT NULL,
  `details` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `admin_activity_logs_adminId_idx` (`adminId`),
  KEY `admin_activity_logs_createdAt_idx` (`createdAt`),
  CONSTRAINT `admin_activity_logs_adminId_fk` FOREIGN KEY (`adminId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `social_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `platform` enum('facebook','instagram','youtube','tiktok') NOT NULL,
  `accountId` varchar(255) NOT NULL,
  `accountName` varchar(255) NOT NULL,
  `pageId` varchar(255) DEFAULT NULL,
  `accessToken` text DEFAULT NULL,
  `refreshToken` text DEFAULT NULL,
  `tokenExpiresAt` datetime DEFAULT NULL,
  `scopes` text DEFAULT NULL,
  `status` enum('connected','error','disconnected') NOT NULL DEFAULT 'connected',
  `lastSyncAt` timestamp NULL DEFAULT NULL,
  `syncError` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `social_accounts_platform_account_unique` (`platform`,`accountId`),
  KEY `social_accounts_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `social_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `accountId` int NOT NULL,
  `platform` enum('facebook','instagram','youtube','tiktok') NOT NULL,
  `platformPostId` varchar(255) NOT NULL,
  `authorName` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `mediaUrl` varchar(700) DEFAULT NULL,
  `mediaType` enum('image','video','carousel','text') DEFAULT NULL,
  `thumbnailUrl` varchar(700) DEFAULT NULL,
  `postUrl` varchar(700) DEFAULT NULL,
  `publishedAt` datetime DEFAULT NULL,
  `websiteStatus` enum('pending','approved','rejected','published','archived') NOT NULL DEFAULT 'pending',
  `websiteSection` enum('gallery','news','videos','homepage') DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `social_posts_platform_post_unique` (`platform`,`platformPostId`),
  KEY `social_posts_account_idx` (`accountId`),
  KEY `social_posts_websiteStatus_idx` (`websiteStatus`),
  KEY `social_posts_publishedAt_idx` (`publishedAt`),
  CONSTRAINT `social_posts_account_fk` FOREIGN KEY (`accountId`) REFERENCES `social_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `social_sync_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `accountId` int NOT NULL,
  `platform` enum('facebook','instagram','youtube','tiktok') NOT NULL,
  `status` enum('success','partial','failed') NOT NULL,
  `recordsFetched` int NOT NULL DEFAULT 0,
  `recordsImported` int NOT NULL DEFAULT 0,
  `recordsUpdated` int NOT NULL DEFAULT 0,
  `errorMessage` text DEFAULT NULL,
  `startedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `social_sync_logs_account_idx` (`accountId`),
  KEY `social_sync_logs_startedAt_idx` (`startedAt`),
  CONSTRAINT `social_sync_logs_account_fk` FOREIGN KEY (`accountId`) REFERENCES `social_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
