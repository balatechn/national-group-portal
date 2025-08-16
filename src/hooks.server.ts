import type { Handle } from '@sveltejs/kit';
import { initializeDatabase } from '$lib/server/db';

// Initialize database on server startup
initializeDatabase().catch(console.error);

export const handle: Handle = async ({ event, resolve }) => {
	// Allow form submissions from the same origin
	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});

	return response;
};
