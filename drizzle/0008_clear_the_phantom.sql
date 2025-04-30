CREATE TABLE `retro_note_likes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`retro_note_id` int NOT NULL,
	`user_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT '2025-04-30 22:24:45.906',
	CONSTRAINT `retro_note_likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `retro_notes` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-30 22:24:45.906';--> statement-breakpoint
ALTER TABLE `retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-30 22:24:45.906';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-30 22:24:45.905';--> statement-breakpoint
ALTER TABLE `users_to_retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-30 22:24:45.906';