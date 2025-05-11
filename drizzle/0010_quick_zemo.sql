ALTER TABLE `retro_note_likes` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-08 23:06:06.083';--> statement-breakpoint
ALTER TABLE `retro_notes` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-08 23:06:06.083';--> statement-breakpoint
ALTER TABLE `retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-08 23:06:06.082';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-08 23:06:06.082';--> statement-breakpoint
ALTER TABLE `users_to_retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-08 23:06:06.083';--> statement-breakpoint
ALTER TABLE `retro_notes` ADD `grouping_guid` varchar(36);--> statement-breakpoint
ALTER TABLE `retro_notes` ADD `is_ai_generated` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `retro_notes` ADD CONSTRAINT `retro_notes_grouping_guid_unique` UNIQUE(`grouping_guid`);