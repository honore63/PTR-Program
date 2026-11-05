-- Back up the database before applying this migration.
-- Generate a bcrypt hash using PHP's password_hash($password, PASSWORD_BCRYPT, ['cost' => 12])
-- and replace the placeholder below. Never store the plaintext password in this file.
--
-- This targets the existing administrator row (id 1 in the inspected XAMPP database),
-- preserving its ID and all records that reference it. Confirm the UPDATE reports
-- exactly one affected row before committing; otherwise run ROLLBACK.

START TRANSACTION;

UPDATE `users`
SET `email` = 'ptrp@admin.org',
    `passwordHash` = 'REPLACE_WITH_BCRYPT_HASH',
    `role` = 'admin',
    `loginMethod` = 'local',
    `resetToken` = NULL,
    `resetTokenExpires` = NULL
WHERE `id` = 1
  AND `role` = 'admin';

SELECT ROW_COUNT() AS `updated_rows`;

-- Commit only after verifying updated_rows = 1; otherwise issue ROLLBACK.
