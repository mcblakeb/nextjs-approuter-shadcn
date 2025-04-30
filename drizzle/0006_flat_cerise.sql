-- ALTER TABLE `retro_notes` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-26 22:41:46.113';--> statement-breakpoint
-- ALTER TABLE `retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-26 22:41:46.113';--> statement-breakpoint
-- ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-26 22:41:46.112';--> statement-breakpoint
-- ALTER TABLE `users_to_retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-26 22:41:46.113';--> statement-breakpoint
-- ALTER TABLE `retro_notes` ADD `guid` varchar(36);--> statement-breakpoint
-- ALTER TABLE `retros` ADD `guid` varchar(36);--> statement-breakpoint
-- ALTER TABLE `users` ADD `guid` varchar(36);

-- First, add the columns as nullable
ALTER TABLE `retro_notes` ADD `guid` varchar(36);
ALTER TABLE `retros` ADD `guid` varchar(36);
ALTER TABLE `users` ADD `guid` varchar(36);

-- Update existing rows with generated GUIDs
UPDATE `retro_notes` SET `guid` = UUID() WHERE `guid` IS NULL;
UPDATE `retros` SET `guid` = UUID() WHERE `guid` IS NULL;
UPDATE `users` SET `guid` = UUID() WHERE `guid` IS NULL;

-- Finally, modify columns to be NOT NULL
ALTER TABLE `retro_notes` MODIFY COLUMN `guid` varchar(36) NOT NULL;
ALTER TABLE `retros` MODIFY COLUMN `guid` varchar(36) NOT NULL;
ALTER TABLE `users` MODIFY COLUMN `guid` varchar(36) NOT NULL;

-- Keep your existing datetime modifications
ALTER TABLE `retro_notes` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-26 22:41:46.113';
ALTER TABLE `retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-26 22:41:46.113';
ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-26 22:41:46.112';
ALTER TABLE `users_to_retros` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-04-26 22:41:46.113';