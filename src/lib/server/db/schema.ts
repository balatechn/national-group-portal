import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	age: integer('age')
});

export const itRequests = sqliteTable('it_requests', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	requisitionCode: text('requisition_code').notNull(),
	dateOfRequest: text('date_of_request').notNull(),
	typeOfSystem: text('type_of_system').notNull(),
	quantity: text('quantity').notNull(),
	model: text('model'),
	proposedConfiguration: text('proposed_configuration'),
	requestedBy: text('requested_by').notNull(),
	purposeOfRequest: text('purpose_of_request').notNull(),
	usernameDesignation: text('username_designation').notNull(),
	emailIdRequest: text('email_id_request'),
	dateOfJoining: text('date_of_joining'),
	createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
	updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP')
});
