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

-- ============================================================
-- Seed default admin user
-- ============================================================
-- Default admin: email = "Residents teachers", password = "Ptrp100"
-- Password hash for "Ptrp100" using PASSWORD_BCRYPT cost 12
INSERT IGNORE INTO `users` (email, passwordHash, name, role, loginMethod, lastSignedIn)
VALUES ('Residents teachers', '$2y$12$qzy0UYcQIDtMAKIa0QN0/ezs/U8aJxs3qAPkZfyiiwhVBZUPWrEOa', 'Resident Teachers', 'admin', 'local', NOW());

-- ============================================================
-- Seed sample data for demonstration
-- ============================================================
INSERT IGNORE INTO `schools` (name, district, description, status) VALUES
  ('Lincoln High School', 'Springfield', 'Partner demonstration school for teacher residency.', 'published'),
  ('Roosevelt Elementary', 'Shelbyville', 'Primary demonstration school for guided teaching practice.', 'published'),
  ('Washington Middle School', 'Capital City', 'Model school for residency training.', 'published');

INSERT IGNORE INTO `teachers` (fullName, email, phone, schoolId, bio, photoUrl, status) VALUES
  ('Maria Garcia', 'maria.garcia@school.edu', '555-0101', 1, 'Third-grade teacher with 5 years of experience.', NULL, 'approved'),
  ('James Wilson', 'james.wilson@school.edu', '555-0102', 2, 'Science teacher focusing on inquiry-based learning.', NULL, 'pending'),
  ('Sarah Chen', 'sarah.chen@school.edu', '555-0103', 3, 'English literature teacher and mentor.', NULL, 'pending');

INSERT IGNORE INTO `alumni` (fullName, email, phone, graduationYear, schoolId, bio, status) VALUES
  ('David Johnson', 'david.johnson@alumni.edu', '555-0201', 2024, 1, 'Teaching 4th grade at Lincoln High School.', 'pending'),
  ('Lisa Wong', 'lisa.wong@alumni.edu', '555-0202', 2024, 2, 'Teaching 2nd grade at Roosevelt Elementary.', 'pending'),
  ('Michael Brown', 'michael.brown@alumni.edu', '555-0203', 2024, 3, 'Teaching 6th grade math at Washington Middle School.', 'pending');

INSERT IGNORE INTO `newsArticles` (slug, title, category, excerpt, body, imageUrl, status, publishedAt) VALUES
  ('welcome-to-alumni-network', 'Welcome to the PTR Alumni Network', 'Announcements', 'Welcome to the official community of PTRP alumni.', 'Welcome to the official digital community of the Primary Teacher Residency Program.', NULL, 'published', NOW()),
  ('first-cohort-graduates', 'First Cohort Graduates Successfully', 'Success Stories', 'Celebrating the first class of PTRP graduates.', 'The first cohort of Primary Teacher Residents has successfully completed the 12-month residency program.', NULL, 'published', NOW());

INSERT IGNORE INTO `galleryItems` (title, caption, url, mediaType, category, status, createdBy) VALUES
  ('Graduation Ceremony', 'Graduation day for the first PTRP cohort', '/manus-storage/ptrp-pilot-launch.jpg', 'image', 'events', 'approved', 1),
  ('Classroom Practice', 'Resident teachers in guided practice', '/manus-storage/ptrp-residents-1.jpg', 'image', 'practice', 'approved', 1);

INSERT IGNORE INTO `bestPractices` (title, category, summary, body, status, createdAt) VALUES
  ('Inquiry-Based Learning', 'Teaching practice', 'Encouraging students to ask questions and explore.', 'Inquiry-based learning is a student-centered approach...', 'published', NOW()),
  ('Differentiated Instruction', 'Teaching practice', 'Tailoring instruction to meet diverse learner needs.', 'Differentiated instruction adapts content...', 'draft', NOW());

-- ============================================================
-- Program Coordinators & Mentors tables
-- ============================================================
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

-- ============================================================
-- Seed program coordinators and mentors
-- ============================================================
-- Coordinators (verified names, placeholder contact details)
INSERT IGNORE INTO `coordinators` (fullName, organization, email, phone, photoUrl, bio, responsibilities, displayOrder, isVisible, status) VALUES
  ('Br. Biziyaremye Ferdinand', 'De La Salle', NULL, NULL, NULL, 'Program Coordinator for PTRP at De La Salle. Coordinates residency activities, mentorship pairing, and school placement for resident teachers.', 'Coordination of resident teachers, mentorship, and school partnerships at De La Salle.', 1, 1, 'published'),
  ('Br. Elias Nshimiyimana', 'SAVE', NULL, NULL, NULL, 'Program Coordinator for PTRP at SAVE. Coordinates residency activities, mentorship pairing, and school placement for resident teachers.', 'Coordination of resident teachers, mentorship, and school partnerships at SAVE.', 2, 1, 'published');

-- Mentors (placeholder names — administrators complete details later)
INSERT IGNORE INTO `mentors` (fullName, organization, email, phone, photoUrl, bio, responsibilities, displayOrder, isVisible, status) VALUES
  ('[Mentor Name - De La Salle]', 'De La Salle', NULL, NULL, NULL, 'Program mentor for resident teachers at De La Salle. Contact details and biography to be completed by the program administrator.', 'Mentor resident teachers during guided classroom practice.', 1, 1, 'draft'),
  ('[Mentor Name - De La Salle]', 'De La Salle', NULL, NULL, NULL, 'Program mentor for resident teachers at De La Salle. Contact details and biography to be completed by the program administrator.', 'Mentor resident teachers during guided classroom practice.', 2, 1, 'draft'),
  ('[Mentor Name - SAVE]', 'SAVE', NULL, NULL, NULL, 'Program mentor for resident teachers at SAVE. Contact details and biography to be completed by the program administrator.', 'Mentor resident teachers during guided classroom practice.', 1, 1, 'draft'),
  ('[Mentor Name - SAVE]', 'SAVE', NULL, NULL, NULL, 'Program mentor for resident teachers at SAVE. Contact details and biography to be completed by the program administrator.', 'Mentor resident teachers during guided classroom practice.', 2, 1, 'draft');

-- ============================================================
-- Social Media Integration tables
-- ============================================================
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
  UNIQUE KEY `social_accounts_platform_account_unique` (`platform`, `accountId`),
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
  UNIQUE KEY `social_posts_platform_post_unique` (`platform`, `platformPostId`),
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
