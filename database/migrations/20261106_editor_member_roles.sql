-- Editor and Member role tiers for the Admin Portal.
-- The public directory continues to use the standard `user` tier; editors hold
-- content-management rights and admins hold full control including user roles.

ALTER TABLE `users` MODIFY COLUMN `role` enum('user','editor','admin') NOT NULL DEFAULT 'user';
