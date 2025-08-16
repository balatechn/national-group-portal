import { db } from '$lib/server/db/index.js';
import { itRequests } from '$lib/server/db/schema.js';
import type { PageServerLoad } from './$types.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		// Check if database is available
		if (!db) {
			console.error('Database connection not available');
			return {
				requests: [],
				error: 'Database connection not available'
			};
		}

		// Test database connection first
		let requests;
		try {
			requests = await db.select().from(itRequests);
		} catch (dbError) {
			console.error('Database query error:', dbError);
			// If table doesn't exist, return empty array
			if (dbError instanceof Error && dbError.message.includes('no such table')) {
				return {
					requests: [],
					error: 'No requests table found - please submit an IT request first'
				};
			}
			throw dbError;
		}

		// Sort in memory (newest first)
		const sortedRequests = requests.sort((a, b) => {
			const dateA = new Date(a.createdAt || 0);
			const dateB = new Date(b.createdAt || 0);
			return dateB.getTime() - dateA.getTime();
		});

		return {
			requests: sortedRequests.map(request => ({
				...request,
				createdAt: request.createdAt ? 
					new Date(request.createdAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
					}) : 'Unknown'
			}))
		};
	} catch (err) {
		console.error('Error in reports page load:', err);
		// Don't throw error, just return empty state
		return {
			requests: [],
			error: 'Unable to load reports at this time'
		};
	}
};
