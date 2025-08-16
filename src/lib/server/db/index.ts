import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// Lazy database connection
let _db: ReturnType<typeof drizzle> | null = null;

function getDatabase() {
	if (_db) return _db;

	// Use fallback database URL if not set (for build time)
	const databaseUrl = env.DATABASE_URL || 'file:./local.db';
	
	try {
		const client = createClient({ url: databaseUrl });
		_db = drizzle(client, { schema });
		return _db;
	} catch (error) {
		console.error('Database connection error:', error);
		// Return a mock database for build time
		throw new Error('Database not available');
	}
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
	get(target, prop) {
		return getDatabase()[prop as keyof ReturnType<typeof drizzle>];
	}
});
