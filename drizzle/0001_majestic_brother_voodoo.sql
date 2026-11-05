CREATE TABLE `mediaAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`filename` varchar(255) NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`url` varchar(700) NOT NULL,
	`mimeType` varchar(120) NOT NULL,
	`size` int NOT NULL,
	`altText` varchar(255),
	`status` enum('pending','approved','archived') NOT NULL DEFAULT 'approved',
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mediaAssets_id` PRIMARY KEY(`id`),
	CONSTRAINT `mediaAssets_storageKey_unique` UNIQUE(`storageKey`)
);
--> statement-breakpoint
CREATE TABLE `siteContent` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(255) NOT NULL,
	`summary` text,
	`body` text NOT NULL,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`updatedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteContent_id` PRIMARY KEY(`id`),
	CONSTRAINT `siteContent_slug_unique` UNIQUE(`slug`)
);
