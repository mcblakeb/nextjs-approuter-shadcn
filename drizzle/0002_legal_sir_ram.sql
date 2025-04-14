CREATE TABLE `retro_notes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`retro_id` int NOT NULL,
	`content` text NOT NULL,
	`category` text,
	`created_at` datetime NOT NULL DEFAULT '2025-04-13 23:53:42.727',
	CONSTRAINT `retro_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `retros` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`email` text NOT NULL,
	`date` date NOT NULL,
	`slug` text NOT NULL,
	`created_at` datetime NOT NULL DEFAULT '2025-04-13 23:53:42.726',
	`updated_at` datetime,
	CONSTRAINT `retros_id` PRIMARY KEY(`id`)
);
