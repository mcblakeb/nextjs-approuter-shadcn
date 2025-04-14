ALTER TABLE `retro_notes` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-14 04:36:37.639';--> statement-breakpoint
ALTER TABLE `retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-14 04:36:37.638';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `image` varchar(512);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `google_id` varchar(255);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-14 04:36:37.638';--> statement-breakpoint
ALTER TABLE `users_to_retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-14 04:36:37.639';