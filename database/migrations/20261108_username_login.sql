-- Add a unique, nullable username field without changing existing account IDs,
-- roles, or password hashes.
SET @username_column_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'username'
);
SET @username_column_sql = IF(
  @username_column_exists = 0,
  'ALTER TABLE `users` ADD COLUMN `username` varchar(100) DEFAULT NULL AFTER `name`',
  'SELECT 1'
);
PREPARE username_column_statement FROM @username_column_sql;
EXECUTE username_column_statement;
DEALLOCATE PREPARE username_column_statement;

SET @username_index_exists = (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND INDEX_NAME = 'users_username_unique'
);
SET @username_index_sql = IF(
  @username_index_exists = 0,
  'ALTER TABLE `users` ADD UNIQUE KEY `users_username_unique` (`username`)',
  'SELECT 1'
);
PREPARE username_index_statement FROM @username_index_sql;
EXECUTE username_index_statement;
DEALLOCATE PREPARE username_index_statement;

-- Map the requested login alias to the existing administrator row only.
-- Do not create an account or alter its ID, role, or password hash.
UPDATE `users`
SET `username` = 'Resistant'
WHERE LOWER(`email`) = LOWER('ptrpresidenteachers100@gmail.com')
  AND `role` = 'admin';
