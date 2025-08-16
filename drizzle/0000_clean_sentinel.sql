CREATE TABLE `it_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`requisition_code` text NOT NULL,
	`date_of_request` text NOT NULL,
	`type_of_system` text NOT NULL,
	`quantity` text NOT NULL,
	`model` text,
	`proposed_configuration` text,
	`requested_by` text NOT NULL,
	`purpose_of_request` text NOT NULL,
	`username_designation` text NOT NULL,
	`email_id_request` text,
	`date_of_joining` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`age` integer
);
