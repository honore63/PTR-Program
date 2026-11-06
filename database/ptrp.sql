CREATE DATABASE IF NOT EXISTS `ptrp`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `ptrp`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(320) DEFAULT NULL,
  `passwordHash` varchar(255) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `role` enum('user','editor','admin') NOT NULL DEFAULT 'user',
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
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','editor','admin') NOT NULL DEFAULT 'user';

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
  ('contactEmail', 'info@ptr.rw'),
  ('primaryColor', '#0b2347'),
  ('accentColor', '#0098d9');

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

-- Seed the verified PTRP model schools, news, and gallery photos. No sample profiles are created.
INSERT IGNORE INTO `schools` (`name`, `district`, `description`, `latitude`, `longitude`, `status`) VALUES
  ('GS Matimba', 'Nyagatare', NULL, -1.1192116, 30.4293638, 'published'),
  ('GS Jean de la Mennais Kirambo', 'Burera', NULL, -1.5078282, 29.8432030, 'published'),
  ('GS Byumba Catholique', 'Gicumbi', NULL, -1.5739545, 30.0547538, 'published'),
  ('GS Bihinga', 'Gatsibo', NULL, -1.6119493, 30.3823329, 'published'),
  ('GS Akanzu', 'Rwamagana', NULL, -2.0310475, 30.3336315, 'published'),
  ('Rukara Model School', 'Kayonza', NULL, -1.8007845, 30.5034396, 'published'),
  ('GS Zaza A', 'Ngoma', NULL, -2.1547942, 30.4303954, 'published'),
  ('GS Mayange A', 'Bugesera', NULL, -2.1857909, 30.0958743, 'published'),
  ('GS St Jean Paul II', 'Gisagara', 'Recently called ES Save', -2.6529852, 29.8352303, 'published'),
  ('GS St Laurent Cyahinda', 'Nyaruguru', NULL, -2.7426028, 29.6127451, 'published'),
  ('GS Mururu', 'Rusizi', NULL, -2.5067736, 28.8952211, 'published'),
  ('GS Uwinkomo', 'Nyamagabe', NULL, -2.5028998, 29.4770416, 'published'),
  ('GS Rubengera I', 'Karongi', NULL, -2.0424556, 29.4126085, 'published'),
  ('GS Muramba B', 'Ngororero', NULL, -1.7638062, 29.6151639, 'published'),
  ('GS St Etienne', 'Muhanga', NULL, -2.1299460, 29.7774184, 'published'),
  ('G.S Umubano I', 'Rubavu', NULL, -1.6819550, 29.2537440, 'published'),
  ('GS Nyarusange', 'Rwamagana', 'Confirm the school identity and district with program administrators.', -1.9335036, 30.4529740, 'published');

INSERT IGNORE INTO `newsArticles` (`slug`, `title`, `category`, `excerpt`, `body`, `imageUrl`, `status`, `publishedAt`) VALUES
  (
    'celebrating-excellence-in-teacher-education',
    'Celebrating Excellence in Teacher Education: The Success of the Primary Teacher Residency Program (PTRP)',
    'Success Stories',
    'On 5 August 2024, a remarkable milestone was celebrated in Rwanda''s education sector as 100 Primary Teacher Residents graduated from the one-year Primary Teacher Residency Program.',
    'On 5 August 2024, a remarkable milestone was celebrated in Rwanda''s education sector as 100 Primary Teacher Residents graduated from the one-year Primary Teacher Residency Program.\n\nThe commissioning ceremony was more than a celebration of graduation. It was a recognition of dedication, resilience, professional growth, and the collective commitment to transforming the quality of primary education in Rwanda.\n\nThe successful completion of this pilot showed the importance of investing in teachers, strengthening professional competencies, and equipping educators with the knowledge, practical skills, and confidence to respond effectively to the diverse learning needs of pupils.\n\nBehind this achievement was a strong partnership involving the RAINWATER Foundation, Rwanda Basic Education Board (REB), Inspire, Educate and Empower Rwanda (IEE), Bridge2Rwanda, and Florida State University.\n\nSpecial recognition goes to the Teacher Residents, tutors, mentors, implementing partners, and all stakeholders. A nation that invests in its teachers invests in the future of its children. Together, let us continue to Inspire, Educate and Empower!',
    '/manus-storage/ptrp-pilot-launch.jpg',
    'published',
    '2024-08-05 00:00:00'
  ),
  (
    'lsi-encouraging-results',
    'LSI reports encouraging results from the Primary Teacher Residency Program',
    'Announcements',
    'Florida State University''s Learning Systems Institute reported positive outcomes from the PTRP pilot, including strong performance in observed lessons and growth in literacy, mathematics, and science.',
    'Florida State University''s Learning Systems Institute reported encouraging results from the Primary Teacher Residency Program in Rwanda.\n\nMore than 80 teacher residents received a performance rating of meets or exceeds expectations in all three observed lessons during term two.\n\nResidents continued to grow in literacy, mathematics, and science knowledge, skills, and attitudes, with increased confidence in teaching, English literacy, and ICT use.',
    '/manus-storage/ptrp-residents-2.jpg',
    'published',
    '2024-06-27 00:00:00'
  ),
  (
    'commissioning-ceremony-in-pictures',
    'Commissioning ceremony in pictures and video',
    'Videos',
    'Relive the celebration as 100 Teacher Residents mark the end of their residency year and the beginning of their journey as PTRP alumni.',
    'The commissioning ceremony brought together residents, tutors, mentors, partners, and education leaders to celebrate the first PTRP cohort.\n\nPhotos and video from the day are being prepared for the gallery. Alumni can contribute approved media through the network.',
    '/manus-storage/ptrp-pilot-launch.jpg',
    'published',
    '2024-08-05 00:00:00'
  );

INSERT IGNORE INTO `galleryItems` (`title`, `caption`, `url`, `mediaType`, `category`, `status`) VALUES
  ('PTRP community moment 1', 'PTRP community moment 1', '/gallery/gallery-01.jpg', 'image', 'community', 'approved'),
  ('PTRP community moment 2', 'PTRP community moment 2', '/gallery/gallery-02.jpg', 'image', 'community', 'approved'),
  ('PTRP community moment 3', 'PTRP community moment 3', '/gallery/gallery-03.jpg', 'image', 'community', 'approved'),
  ('PTRP community moment 4', 'PTRP community moment 4', '/gallery/gallery-04.jpg', 'image', 'community', 'approved'),
  ('PTRP community moment 5', 'PTRP community moment 5', '/gallery/gallery-05.jpg', 'image', 'community', 'approved'),
  ('PTRP community moment 6', 'PTRP community moment 6', '/gallery/gallery-06.jpg', 'image', 'community', 'approved'),
  ('PTRP community moment 7', 'PTRP community moment 7', '/gallery/gallery-07.jpg', 'image', 'community', 'approved'),
  ('PTRP community moment 8', 'PTRP community moment 8', '/gallery/gallery-08.jpg', 'image', 'community', 'approved'),
  ('PTRP community moment 9', 'PTRP community moment 9', '/gallery/gallery-09.jpg', 'image', 'community', 'approved'),
  ('PTRP community moment 10', 'PTRP community moment 10', '/gallery/gallery-10.jpg', 'image', 'community', 'approved'),
  ('PTRP community moment 11', 'PTRP community moment 11', '/gallery/gallery-11.jpg', 'image', 'community', 'approved');

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
-- Coordinators (verified names and contact details)
INSERT IGNORE INTO `coordinators` (fullName, organization, email, phone, photoUrl, bio, responsibilities, displayOrder, isVisible, status) VALUES
  ('Br. BIZIYAREMYE Ferdinand', 'TTC De La Salle Byumba', NULL, '+250 789 139 618', NULL, NULL, 'Coordinator of PTRP', 1, 1, 'published'),
  ('Br. Elias Nshimiyimana', 'SAVE', 'nshimiyimanaelias52@gmail.com', '+250 781 418 869', NULL, NULL, 'Coordinator of PTRP', 2, 1, 'published');

UPDATE `coordinators`
SET fullName = 'Br. BIZIYAREMYE Ferdinand',
    organization = 'TTC De La Salle Byumba',
    email = NULL,
    phone = '+250 789 139 618',
    bio = NULL,
    responsibilities = 'Coordinator of PTRP',
    displayOrder = 1,
    isVisible = 1,
    status = 'published'
WHERE fullName IN ('Br. Biziyaremye Ferdinand', 'Br. BIZIYAREMYE Ferdinand')
  AND organization IN ('De La Salle', 'TTC De La Salle Byumba');

UPDATE `coordinators`
SET email = 'nshimiyimanaelias52@gmail.com',
    phone = '+250 781 418 869',
    bio = NULL,
    responsibilities = 'Coordinator of PTRP',
    displayOrder = 2,
    isVisible = 1,
    status = 'published'
WHERE fullName = 'Br. Elias Nshimiyimana'
  AND organization = 'SAVE';

-- Mentors (placeholder names — administrators complete details later)
INSERT IGNORE INTO `mentors` (fullName, organization, email, phone, photoUrl, bio, responsibilities, displayOrder, isVisible, status) VALUES
  ('[Mentor Name - De La Salle]', 'De La Salle', NULL, NULL, NULL, 'Program mentor for resident teachers at De La Salle. Contact details and biography to be completed by the program administrator.', 'Mentor resident teachers during guided classroom practice.', 1, 1, 'draft'),
  ('[Mentor Name - De La Salle]', 'De La Salle', NULL, NULL, NULL, 'Program mentor for resident teachers at De La Salle. Contact details and biography to be completed by the program administrator.', 'Mentor resident teachers during guided classroom practice.', 2, 1, 'draft'),
  ('[Mentor Name - SAVE]', 'SAVE', NULL, NULL, NULL, 'Program mentor for resident teachers at SAVE. Contact details and biography to be completed by the program administrator.', 'Mentor resident teachers during guided classroom practice.', 1, 1, 'draft'),
  ('[Mentor Name - SAVE]', 'SAVE', NULL, NULL, NULL, 'Program mentor for resident teachers at SAVE. Contact details and biography to be completed by the program administrator.', 'Mentor resident teachers during guided classroom practice.', 2, 1, 'draft');

-- ============================================================
-- Resident Teacher Profiles tables
-- ============================================================
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
  `isAlumni` tinyint(1) NOT NULL DEFAULT 0,
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

INSERT IGNORE INTO `resident_teachers`
  (`fullName`, `email`, `phone`, `modelSchool`, `position`, `bestPractice`, `bestPracticeDescription`, `subjects`, `skills`, `contributions`, `bio`, `photoUrl`, `status`, `isFeatured`, `isAlumni`, `displayOrder`, `publishedAt`)
VALUES
  (
    'Honore Tuyishime',
    'tuyishimehonore63@gmail.com',
    '0791684429',
    'Rukara Model School',
    'Program Designer, ICT Integration in Education Practitioner, and Website Manager',
    'ICT Integration in Education',
    'Designed and developed the 21st Century Lesson Plan Generator, a digital platform supporting teachers in creating competency-based, learner-centred lesson plans.',
    'ICT Integration in Education, Competency-Based Education, Learner-Centred Lesson Planning',
    'Program Design, Educational Technology, Website Management, Digital Learning',
    'Designed and developed the 21st Century Lesson Plan Generator, a digital platform supporting teachers in creating competency-based, learner-centred lesson plans.',
    'Honore Tuyishime is a Resident Teacher at Rukara Model School and a PTRP Alumni Network member. As a program designer, ICT integration practitioner, and website manager, he brings technology and practical digital tools into teacher development.',
    'honore-tuyishime.png',
    'published',
    1,
    1,
    -10000,
    NOW()
  );

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

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `type` varchar(60) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `readAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `notifications_userId_idx` (`userId`),
  KEY `notifications_readAt_idx` (`readAt`),
  CONSTRAINT `notifications_userId_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `page_views` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `referrer` varchar(500) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `page_views_createdAt_idx` (`createdAt`),
  KEY `page_views_path_idx` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS `contactMessages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `submissionKey` char(36) NOT NULL,
  `senderName` varchar(255) NOT NULL,
  `senderEmail` varchar(320) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `ipHash` char(64) NOT NULL,
  `deliveryStatus` enum('pending','sending','sent','failed') NOT NULL DEFAULT 'pending',
  `deliveryError` varchar(500) DEFAULT NULL,
  `deliveryAttempts` smallint unsigned NOT NULL DEFAULT 0,
  `lastAttemptAt` datetime DEFAULT NULL,
  `deliveredAt` datetime DEFAULT NULL,
  `readAt` datetime DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contactMessages_submissionKey_unique` (`submissionKey`),
  KEY `contactMessages_deliveryStatus_idx` (`deliveryStatus`),
  KEY `contactMessages_readAt_createdAt_idx` (`readAt`,`createdAt`),
  KEY `contactMessages_ipHash_createdAt_idx` (`ipHash`,`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
