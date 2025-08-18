import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	try {
		// Try to import database and load real data
		const { db, initializeDatabase } = await import('$lib/server/db/index.js');
		const { itRequests } = await import('$lib/server/db/schema.js');
		
		// Try to initialize and query database
		try {
			await initializeDatabase();
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

			// If no real data, show empty state message
			return {
				requests: [],
				demo: false,
				message: 'No IT requests found. Submit a request to see it here!'
			};
		} catch (dbError) {
			console.log('Database error, falling back to demo data:', dbError);
			throw dbError; // Re-throw to be caught by outer catch
		}
		
	} catch (error) {
		console.log('Database not available, using demo data:', error);
		
		// Return demo data when database is not available
		return {
			requests: [
				{
					id: 1,
					requisitionCode: 'IT2508-DEMO',
					dateOfRequest: '2025-08-18',
					typeOfSystem: 'Laptop',
					quantity: '1',
					model: 'Dell Inspiron 15',
					requestedBy: 'John Doe',
					purposeOfRequest: 'Development work and testing',
					usernameDesignation: 'Senior Developer',
					emailIdRequest: 'john.doe@company.com',
					dateOfJoining: '2024-01-15',
					createdAt: 'Aug 18, 2025, 07:00 PM'
				},
				{
					id: 2,
					requisitionCode: 'IT2508-DEMO2',
					dateOfRequest: '2025-08-17',
					typeOfSystem: 'Desktop',
					quantity: '1',
					model: 'HP EliteDesk',
					requestedBy: 'Jane Smith',
					purposeOfRequest: 'Design and graphics work',
					usernameDesignation: 'UI/UX Designer',
					emailIdRequest: 'jane.smith@company.com',
					dateOfJoining: '2024-03-01',
					createdAt: 'Aug 17, 2025, 02:30 PM'
				}
			],
			demo: true,
			message: 'Database temporarily unavailable. Showing demo data. Your submitted requests will be saved when the database is restored.'
		};
	}
};
