-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `CardCategory` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`category_name` varchar(255) NOT NULL,
	CONSTRAINT `CardCategory_id` PRIMARY KEY(`id`),
	CONSTRAINT `id` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `CardWord` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`english` varchar(255) NOT NULL,
	`spanish` varchar(255) NOT NULL,
	`category_id` int NOT NULL,
	CONSTRAINT `CardWord_id` PRIMARY KEY(`id`),
	CONSTRAINT `id` UNIQUE(`id`)
);

*/