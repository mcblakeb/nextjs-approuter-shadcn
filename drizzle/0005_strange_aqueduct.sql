ALTER TABLE `retro_notes` MODIFY COLUMN `category` varchar(100);--> statement-breakpoint
ALTER TABLE `retro_notes` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-14 04:39:31.218';--> statement-breakpoint
ALTER TABLE `retros` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `retros` MODIFY COLUMN `slug` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-14 04:39:31.218';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-14 04:39:31.217';--> statement-breakpoint
ALTER TABLE `users_to_retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-14 04:39:31.218';