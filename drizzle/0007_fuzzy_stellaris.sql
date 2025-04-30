ALTER TABLE `retro_notes` MODIFY COLUMN `guid` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `retro_notes` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-27 02:32:58.774';--> statement-breakpoint
ALTER TABLE `retros` MODIFY COLUMN `guid` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-27 02:32:58.774';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `guid` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-27 02:32:58.773';--> statement-breakpoint
ALTER TABLE `users_to_retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-27 02:32:58.774';--> statement-breakpoint
ALTER TABLE `retro_notes` ADD CONSTRAINT `retro_notes_guid_unique` UNIQUE(`guid`);--> statement-breakpoint
ALTER TABLE `retros` ADD CONSTRAINT `retros_guid_unique` UNIQUE(`guid`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_guid_unique` UNIQUE(`guid`);