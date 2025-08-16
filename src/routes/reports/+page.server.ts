import { db } from '$lib/server/db/index.js';
import { itRequests } from '$lib/server/db/schema.js';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	try {
		// Fetch all IT requests ordered by creation date (newest first)
		const requests = await db
			.select()
			.from(itRequests)
			.orderBy(desc(itRequests.createdAt));

		return {
			requests: requests.map(request => ({
				...request,
				createdAt: new Date(request.createdAt).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			}))
		};
	} catch (error) {
		console.error('Error fetching IT requests:', error);
		return {
			requests: []
		};
	}
};
