import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

let dbInstance: any = null;
let clientInstance: any = null;
let isInitialized = false;

// Get database URL based on environment
function getDatabaseUrl(): string {
	if (env.DATABASE_URL) {
		// Use provided DATABASE_URL (for production with external DB)
		return env.DATABASE_URL;
	} else if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
		// For production without external DB, use in-memory database
		return ':memory:';
	} else {
		// For development, use local file
		return 'file:./local.db';
	}
}

// Lazy database connection
function getDatabase() {
	if (!dbInstance) {
		try {
			const databaseUrl = getDatabaseUrl();
			console.log('Database URL:', databaseUrl);
			
			clientInstance = createClient({ url: databaseUrl });
			dbInstance = drizzle(clientInstance, { schema });
		} catch (error) {
			console.error('Error creating database connection:', error);
			return null;
		}
	}
	return dbInstance;
}

// Initialize database tables
export async function initializeDatabase() {
	try {
		const db = getDatabase();
		if (!db || !clientInstance) {
			throw new Error('Database connection not available');
		}

		// Create tables if they don't exist using raw SQL
		await clientInstance.execute(`
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
		
		isInitialized = true;
		console.log('Database initialized successfully');
	} catch (error) {
		console.error('Error initializing database:', error);
		throw error;
	}
}

// Export database with lazy loading
export const db = new Proxy({} as any, {
	get(target, prop) {
		const database = getDatabase();
		if (!database) {
			throw new Error('Database connection not available');
		}
		return database[prop];
	}
});
