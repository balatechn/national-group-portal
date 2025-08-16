import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	// For now, return mock data to ensure the page works
	// This will be replaced once database is properly set up in production
	try {
		// Try to import database - if it fails, use mock data
		const { db } = await import('$lib/server/db/index.js');
		const { itRequests } = await import('$lib/server/db/schema.js');
		
		if (!db) {
			throw new Error('Database not available');
		}

		const requests = await db.select().from(itRequests);
		
		return {
			requests: requests.map(request => ({
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
	} catch (error) {
		console.log('Database not available, using demo data:', error);
		
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
				},
				{
					id: 2,
					requisitionCode: 'IT2508-DEMO2',
					dateOfRequest: '2025-08-15',
					typeOfSystem: 'Desktop',
					quantity: '1',
					model: 'HP EliteDesk',
					requestedBy: 'Jane Smith',
					purposeOfRequest: 'Design and graphics work',
					usernameDesignation: 'UI/UX Designer',
					emailIdRequest: 'jane.smith@company.com',
					dateOfJoining: '2024-03-01',
					createdAt: 'Aug 15, 2025, 02:30 PM'
				}
			],
			demo: true
		};
	}
};
