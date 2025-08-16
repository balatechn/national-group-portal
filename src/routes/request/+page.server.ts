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

			// Insert into database
			await db.insert(itRequests).values({
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

			return { success: true, message: 'IT request submitted successfully!' };
		} catch (error) {
			console.error('Error saving IT request:', error);
			return fail(500, { message: 'Failed to submit request. Please try again.' });
		}
	}
};
