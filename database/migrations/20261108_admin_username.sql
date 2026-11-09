-- Adds username sign-in support and assigns the username "Resistant" to the
-- existing PTRP administrator account. The account ID, role, email address and
-- password hash are preserved; no account is created.

SET @has_username := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'username');
SET @sql := IF(@has_username = 0, 'ALTER TABLE `users` ADD COLUMN `username` VARCHAR(100) NULL AFTER `name`', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_username_index := (SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND INDEX_NAME = 'users_username_unique');
SET @sql := IF(@has_username_index = 0, 'ALTER TABLE `users` ADD UNIQUE KEY `users_username_unique` (`username`)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE `users`
SET `username` = 'Resistant'
WHERE LOWER(`email`) = 'ptrpresidenteachers100@gmail.com'
  AND `role` = 'admin'
  AND (`username` IS NULL OR `username` = '')
  AND NOT EXISTS (SELECT 1 FROM (SELECT `id` FROM `users` WHERE LOWER(`username`) = 'resistant') AS taken);
