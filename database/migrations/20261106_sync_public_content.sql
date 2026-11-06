-- Apply after 20261106_feature_honore_tuyishime.sql.
-- Adds a managed alumni flag and imports existing verified site content.
SET @ptrp_has_is_alumni := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'resident_teachers'
    AND COLUMN_NAME = 'isAlumni'
);
SET @ptrp_add_is_alumni_sql := IF(
  @ptrp_has_is_alumni = 0,
  'ALTER TABLE `resident_teachers` ADD COLUMN `isAlumni` tinyint(1) NOT NULL DEFAULT 0 AFTER `isFeatured`',
  'SELECT 1'
);
PREPARE ptrp_add_is_alumni FROM @ptrp_add_is_alumni_sql;
EXECUTE ptrp_add_is_alumni;
DEALLOCATE PREPARE ptrp_add_is_alumni;

UPDATE `resident_teachers`
SET `isAlumni` = 1
WHERE LOWER(`email`) = 'tuyishimehonore63@gmail.com';

INSERT INTO `newsArticles` (`slug`, `title`, `category`, `excerpt`, `body`, `imageUrl`, `status`, `publishedAt`)
SELECT
  'celebrating-excellence-in-teacher-education',
  'Celebrating Excellence in Teacher Education: The Success of the Primary Teacher Residency Program (PTRP)',
  'Success Stories',
  'On 5 August 2024, a remarkable milestone was celebrated in Rwanda''s education sector as 100 Primary Teacher Residents graduated from the one-year Primary Teacher Residency Program.',
  'On 5 August 2024, a remarkable milestone was celebrated in Rwanda''s education sector as 100 Primary Teacher Residents graduated from the one-year Primary Teacher Residency Program.

The commissioning ceremony was more than a celebration of graduation. It was a recognition of dedication, resilience, professional growth, and the collective commitment to transforming the quality of primary education in Rwanda.

The successful completion of this pilot showed the importance of investing in teachers, strengthening professional competencies, and equipping educators with the knowledge, practical skills, and confidence to respond effectively to the diverse learning needs of pupils.

Behind this achievement was a strong partnership involving the RAINWATER Foundation, Rwanda Basic Education Board (REB), Inspire, Educate and Empower Rwanda (IEE), Bridge2Rwanda, and Florida State University.

Special recognition goes to the Teacher Residents, tutors, mentors, implementing partners, and all stakeholders. A nation that invests in its teachers invests in the future of its children. Together, let us continue to Inspire, Educate and Empower!',
  '/manus-storage/ptrp-pilot-launch.jpg',
  'published',
  '2024-08-05 00:00:00'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `newsArticles` WHERE `slug` = 'celebrating-excellence-in-teacher-education'
);

INSERT INTO `newsArticles` (`slug`, `title`, `category`, `excerpt`, `body`, `imageUrl`, `status`, `publishedAt`)
SELECT
  'lsi-encouraging-results',
  'LSI reports encouraging results from the Primary Teacher Residency Program',
  'Announcements',
  'Florida State University''s Learning Systems Institute reported positive outcomes from the PTRP pilot, including strong performance in observed lessons and growth in literacy, mathematics, and science.',
  'Florida State University''s Learning Systems Institute reported encouraging results from the Primary Teacher Residency Program in Rwanda.

More than 80 teacher residents received a performance rating of meets or exceeds expectations in all three observed lessons during term two.

Residents continued to grow in literacy, mathematics, and science knowledge, skills, and attitudes, with increased confidence in teaching, English literacy, and ICT use.',
  '/manus-storage/ptrp-residents-2.jpg',
  'published',
  '2024-06-27 00:00:00'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `newsArticles` WHERE `slug` = 'lsi-encouraging-results'
);

INSERT INTO `newsArticles` (`slug`, `title`, `category`, `excerpt`, `body`, `imageUrl`, `status`, `publishedAt`)
SELECT
  'commissioning-ceremony-in-pictures',
  'Commissioning ceremony in pictures and video',
  'Videos',
  'Relive the celebration as 100 Teacher Residents mark the end of their residency year and the beginning of their journey as PTRP alumni.',
  'The commissioning ceremony brought together residents, tutors, mentors, partners, and education leaders to celebrate the first PTRP cohort.

Photos and video from the day are being prepared for the gallery. Alumni can contribute approved media through the network.',
  '/manus-storage/ptrp-pilot-launch.jpg',
  'published',
  '2024-08-05 00:00:00'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `newsArticles` WHERE `slug` = 'commissioning-ceremony-in-pictures'
);

INSERT INTO `galleryItems` (`title`, `caption`, `url`, `mediaType`, `category`, `status`)
SELECT 'PTRP community moment 1', 'PTRP community moment 1', '/gallery/gallery-01.jpg', 'image', 'community', 'approved'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `galleryItems` WHERE `title` = 'PTRP community moment 1' AND `url` = '/gallery/gallery-01.jpg');

INSERT INTO `galleryItems` (`title`, `caption`, `url`, `mediaType`, `category`, `status`)
SELECT 'PTRP community moment 2', 'PTRP community moment 2', '/gallery/gallery-02.jpg', 'image', 'community', 'approved'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `galleryItems` WHERE `title` = 'PTRP community moment 2' AND `url` = '/gallery/gallery-02.jpg');

INSERT INTO `galleryItems` (`title`, `caption`, `url`, `mediaType`, `category`, `status`)
SELECT 'PTRP community moment 3', 'PTRP community moment 3', '/gallery/gallery-03.jpg', 'image', 'community', 'approved'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `galleryItems` WHERE `title` = 'PTRP community moment 3' AND `url` = '/gallery/gallery-03.jpg');

INSERT INTO `galleryItems` (`title`, `caption`, `url`, `mediaType`, `category`, `status`)
SELECT 'PTRP community moment 4', 'PTRP community moment 4', '/gallery/gallery-04.jpg', 'image', 'community', 'approved'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `galleryItems` WHERE `title` = 'PTRP community moment 4' AND `url` = '/gallery/gallery-04.jpg');

INSERT INTO `galleryItems` (`title`, `caption`, `url`, `mediaType`, `category`, `status`)
SELECT 'PTRP community moment 5', 'PTRP community moment 5', '/gallery/gallery-05.jpg', 'image', 'community', 'approved'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `galleryItems` WHERE `title` = 'PTRP community moment 5' AND `url` = '/gallery/gallery-05.jpg');

INSERT INTO `galleryItems` (`title`, `caption`, `url`, `mediaType`, `category`, `status`)
SELECT 'PTRP community moment 6', 'PTRP community moment 6', '/gallery/gallery-06.jpg', 'image', 'community', 'approved'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `galleryItems` WHERE `title` = 'PTRP community moment 6' AND `url` = '/gallery/gallery-06.jpg');

INSERT INTO `galleryItems` (`title`, `caption`, `url`, `mediaType`, `category`, `status`)
SELECT 'PTRP community moment 7', 'PTRP community moment 7', '/gallery/gallery-07.jpg', 'image', 'community', 'approved'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `galleryItems` WHERE `title` = 'PTRP community moment 7' AND `url` = '/gallery/gallery-07.jpg');

INSERT INTO `galleryItems` (`title`, `caption`, `url`, `mediaType`, `category`, `status`)
SELECT 'PTRP community moment 8', 'PTRP community moment 8', '/gallery/gallery-08.jpg', 'image', 'community', 'approved'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `galleryItems` WHERE `title` = 'PTRP community moment 8' AND `url` = '/gallery/gallery-08.jpg');

INSERT INTO `galleryItems` (`title`, `caption`, `url`, `mediaType`, `category`, `status`)
SELECT 'PTRP community moment 9', 'PTRP community moment 9', '/gallery/gallery-09.jpg', 'image', 'community', 'approved'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `galleryItems` WHERE `title` = 'PTRP community moment 9' AND `url` = '/gallery/gallery-09.jpg');

INSERT INTO `galleryItems` (`title`, `caption`, `url`, `mediaType`, `category`, `status`)
SELECT 'PTRP community moment 10', 'PTRP community moment 10', '/gallery/gallery-10.jpg', 'image', 'community', 'approved'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `galleryItems` WHERE `title` = 'PTRP community moment 10' AND `url` = '/gallery/gallery-10.jpg');

INSERT INTO `galleryItems` (`title`, `caption`, `url`, `mediaType`, `category`, `status`)
SELECT 'PTRP community moment 11', 'PTRP community moment 11', '/gallery/gallery-11.jpg', 'image', 'community', 'approved'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `galleryItems` WHERE `title` = 'PTRP community moment 11' AND `url` = '/gallery/gallery-11.jpg');
