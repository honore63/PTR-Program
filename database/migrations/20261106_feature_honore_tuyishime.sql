-- Publish Honore Tuyishime as the first featured resident teacher without
-- replacing profile details already edited by an administrator.

INSERT INTO `resident_teachers`
  (`fullName`, `email`, `phone`, `modelSchool`, `position`, `bestPractice`, `bestPracticeDescription`, `subjects`, `skills`, `contributions`, `bio`, `photoUrl`, `status`, `isFeatured`, `displayOrder`, `publishedAt`)
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
    -10000,
    NOW()
  )
ON DUPLICATE KEY UPDATE
  `status` = 'published',
  `isFeatured` = 1,
  `displayOrder` = -10000,
  `publishedAt` = COALESCE(`publishedAt`, NOW());
