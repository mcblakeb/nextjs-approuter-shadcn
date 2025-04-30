ALTER TABLE `retro_note_likes` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-30 22:34:55.849';--> statement-breakpoint
ALTER TABLE `retro_notes` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-30 22:34:55.849';--> statement-breakpoint
ALTER TABLE `retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-30 22:34:55.849';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-30 22:34:55.848';--> statement-breakpoint
ALTER TABLE `users_to_retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-30 22:34:55.849';