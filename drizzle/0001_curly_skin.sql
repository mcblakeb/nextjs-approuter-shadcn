ALTER TABLE `CardCategory` DROP INDEX `id`;--> statement-breakpoint
ALTER TABLE `CardWord` DROP INDEX `id`;--> statement-breakpoint
ALTER TABLE `CardCategory` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `CardWord` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `CardCategory` ADD `category_desc` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `CardWord` ADD CONSTRAINT `CardWord_category_id_CardCategory_id_fk` FOREIGN KEY (`category_id`) REFERENCES `CardCategory`(`id`) ON DELETE no action ON UPDATE no action;