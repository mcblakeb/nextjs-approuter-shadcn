CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`image` text,
	`google_id` text,
	`created_at` datetime NOT NULL DEFAULT '2025-04-14 04:33:50.660',
	`updated_at` datetime,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_google_id_unique` UNIQUE(`google_id`)
);
--> statement-breakpoint
CREATE TABLE `users_to_retros` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`retro_id` int NOT NULL,
	`role` text DEFAULT ('member'),
	`created_at` datetime NOT NULL DEFAULT '2025-04-14 04:33:50.660',
	CONSTRAINT `users_to_retros_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `retro_notes` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-14 04:33:50.661';--> statement-breakpoint
ALTER TABLE `retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-14 04:33:50.660';--> statement-breakpoint
ALTER TABLE `retro_notes` ADD `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `retro_notes` ADD `category_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `retros` ADD `created_by_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `retros` ADD CONSTRAINT `retros_slug_unique` UNIQUE(`slug`);--> statement-breakpoint
ALTER TABLE `retros` DROP COLUMN `email`;