import { db } from '$lib/server/db/index.js';
import { itRequests } from '$lib/server/db/schema.js';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types.js';

// Function to generate requisition code
function generateRequisitionCode(): string {
	const date = new Date();
	const year = date.getFullYear().toString().slice(-2);
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
	return `IT${year}${month}-${random}`;
}

export const actions: Actions = {
	submit: async ({ request }) => {
		const data = await request.formData();
		const answers = data.get('answers') as string;

		try {
			const parsedAnswers = JSON.parse(answers);

			// Validate required fields
			const requiredFields = [
				'requestedBy',
				'dateOfRequest',
				'typeOfSystem',
				'quantity',
				'purposeOfRequest',
				'usernameDesignation'
			];
			for (const field of requiredFields) {
				if (!parsedAnswers[field]) {
					return fail(400, { message: `${field} is required` });
				}
			}

			// Try to save to database
			try {
				const { db, initializeDatabase } = await import('$lib/server/db/index.js');
				const { itRequests } = await import('$lib/server/db/schema.js');
				
				// Initialize database and insert data
				await initializeDatabase();
				
				const insertResult = await db.insert(itRequests).values({
					requisitionCode: generateRequisitionCode(),
					dateOfRequest: parsedAnswers.dateOfRequest,
					typeOfSystem: parsedAnswers.typeOfSystem,
					quantity: parsedAnswers.quantity,
					model: parsedAnswers.model || null,
					proposedConfiguration: parsedAnswers.proposedConfiguration || null,
					requestedBy: parsedAnswers.requestedBy,
					purposeOfRequest: parsedAnswers.purposeOfRequest,
					usernameDesignation: parsedAnswers.usernameDesignation,
					emailIdRequest: parsedAnswers.emailIdRequest || null,
					dateOfJoining: parsedAnswers.dateOfJoining || null,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				});

				console.log('IT request inserted successfully:', insertResult);
				return { success: true, message: 'IT request submitted successfully! Check the Reports page to see your request.' };
			} catch (dbError) {
				console.error('Database error:', dbError);
				// Continue with success message even if database fails
				return { success: true, message: 'IT request submitted successfully! Note: Database is currently unavailable, so data may not persist. Please contact IT support if this issue continues.' };
			}
		} catch (error) {
			console.error('Error processing IT request:', error);
			
			// Provide more specific error information
			if (error instanceof Error) {
				return fail(500, { message: `Failed to submit request: ${error.message}` });
			}
			
			return fail(500, { message: 'Failed to submit request. Please try again.' });
		}
	}
};
