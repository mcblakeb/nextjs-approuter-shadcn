ALTER TABLE `retro_notes` DROP INDEX `retro_notes_grouping_guid_unique`;--> statement-breakpoint
ALTER TABLE `retro_note_likes` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-11 03:01:08.188';--> statement-breakpoint
ALTER TABLE `retro_notes` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-11 03:01:08.188';--> statement-breakpoint
ALTER TABLE `retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-11 03:01:08.187';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-11 03:01:08.187';--> statement-breakpoint
ALTER TABLE `users_to_retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-11 03:01:08.188';