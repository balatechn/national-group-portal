import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	try {
		// Try to import database and load real data
		const { db } = await import('$lib/server/db/index.js');
		const { itRequests } = await import('$lib/server/db/schema.js');
		
		if (!db) {
			throw new Error('Database not available');
		}

		// Try to query the database
		const requests = await db.select().from(itRequests);
		
		// Sort in memory (newest first)
		const sortedRequests = requests.sort((a, b) => {
			const dateA = new Date(a.createdAt || 0);
			const dateB = new Date(b.createdAt || 0);
			return dateB.getTime() - dateA.getTime();
		});
		
		// Format the data
		const formattedRequests = sortedRequests.map(request => ({
			...request,
			createdAt: request.createdAt ? 
				new Date(request.createdAt).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				}) : 'Unknown'
		}));

		// If we have real data, return it
		if (formattedRequests.length > 0) {
			return {
				requests: formattedRequests,
				demo: false
			};
		}

		// If no real data, show demo data with a message
		return {
			requests: [
				{
					id: 1,
					requisitionCode: 'IT2508-DEMO',
					dateOfRequest: '2025-08-16',
					typeOfSystem: 'Laptop',
					quantity: '1',
					model: 'Dell Inspiron 15',
					requestedBy: 'John Doe',
					purposeOfRequest: 'Development work and testing',
					usernameDesignation: 'Senior Developer',
					emailIdRequest: 'john.doe@company.com',
					dateOfJoining: '2024-01-15',
					createdAt: 'Aug 16, 2025, 07:00 PM'
				}
			],
			demo: true,
			message: 'No IT requests found in database yet. Submit a request to see it here!'
		};
		
	} catch (error) {
		console.log('Database error, using demo data:', error);
		
		// Return demo data for testing
		return {
			requests: [
				{
					id: 1,
					requisitionCode: 'IT2508-DEMO',
					dateOfRequest: '2025-08-16',
					typeOfSystem: 'Laptop',
					quantity: '1',
					model: 'Dell Inspiron 15',
					requestedBy: 'John Doe',
					purposeOfRequest: 'Development work and testing',
					usernameDesignation: 'Senior Developer',
					emailIdRequest: 'john.doe@company.com',
					dateOfJoining: '2024-01-15',
					createdAt: 'Aug 16, 2025, 07:00 PM'
				}
			],
			demo: true,
			error: 'Database connection failed. Showing demo data.'
		};
	}
};
