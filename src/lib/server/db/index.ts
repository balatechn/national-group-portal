import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// Determine database URL based on environment
let databaseUrl: string;

if (env.DATABASE_URL) {
	// Use provided DATABASE_URL (for production with external DB)
	databaseUrl = env.DATABASE_URL;
} else if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
	// For production without external DB, use in-memory database
	databaseUrl = ':memory:';
} else {
	// For development, use local file
	databaseUrl = 'file:./local.db';
}

console.log('Database URL:', databaseUrl);

const client = createClient({ url: databaseUrl });

export const db = drizzle(client, { schema });

// Initialize database tables
export async function initializeDatabase() {
	try {
		// Create tables if they don't exist using raw SQL
		await client.execute(`
			CREATE TABLE IF NOT EXISTS it_requests (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				requisition_code TEXT NOT NULL,
				date_of_request TEXT NOT NULL,
				type_of_system TEXT NOT NULL,
				quantity TEXT NOT NULL,
				model TEXT,
				proposed_configuration TEXT,
				requested_by TEXT NOT NULL,
				purpose_of_request TEXT NOT NULL,
				username_designation TEXT NOT NULL,
				email_id_request TEXT,
				date_of_joining TEXT,
				created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
			)
		`);
		console.log('Database initialized successfully');
	} catch (error) {
		console.error('Error initializing database:', error);
		throw error;
	}
}

// Initialize on startup
initializeDatabase();
