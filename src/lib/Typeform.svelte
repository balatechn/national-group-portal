<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { enhance } from '$app/forms';

	export let questions: {
		key: string;
		label: string;
		help?: string;
		placeholder?: string;
		required?: boolean;
	}[];

	export let form: { success?: boolean; message?: string } | null = null;

	let current = 0;
	let answers: Record<string, string> = {};
	let input = '';
	let submitting = false;
	let submitResult: { success?: boolean; message?: string } | null = null;
	let editingKey: string | null = null;

	// Check for form result on component load
	$: if (form) {
		if (form.success) {
			submitResult = {
				success: true,
				message: form.message || 'Request submitted successfully!'
			};
		} else if (form.message) {
			submitResult = {
				success: false,
				message: form.message
			};
		}
	}

	let inputElement: HTMLInputElement;

	function next() {
		const q = questions[current];
		if (q.required && !input) return;
		answers[q.key] = input;
		input = '';
		setTimeout(() => {
			current += 1;
			// Focus on the input after the transition
			setTimeout(() => {
				if (inputElement) {
					inputElement.focus();
				}
			}, 500);
		}, 300); // Wait for fade out animation
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			next();
		}
	}

	function editResponse(key: string) {
		editingKey = key;
		input = answers[key];
	}

	function saveEdit() {
		if (editingKey) {
			answers[editingKey] = input;
			editingKey = null;
			input = '';
		}
	}

	function cancelEdit() {
		editingKey = null;
		input = '';
	}

	function handleSubmit() {
		submitting = true;
		return async ({
			update
		}: {
			result: import('@sveltejs/kit').ActionResult;
			update: () => Promise<void>;
		}) => {
			submitting = false;
			await update();
		};
	}
</script>

<div class="typeform">
	{#if current < questions.length}
		{#key current}
			<div class="question" in:fade={{ duration: 600, delay: 200 }} out:fade={{ duration: 300 }}>
				<label for="question-input" class="label">
					<span class="question-number">{current + 1}</span> {questions[current].label}
					{#if questions[current].required}
						<span class="required">*</span>
					{/if}
				</label>
				{#if questions[current].help}
					<p class="help">{questions[current].help}</p>
				{/if}
				<input
					id="question-input"
					bind:value={input}
					bind:this={inputElement}
					placeholder={questions[current].placeholder}
					on:keydown={handleKeydown}
				/>
				<button type="button" on:click={next} class="ok-button">
					OK <span class="hint">press Enter ↵</span>
				</button>
			</div>
		{/key}
	{:else}
		<div class="complete" in:fade={{ duration: 400 }}>
			{#if submitResult}
				{#if submitResult.success}
					<h2>✅ Success!</h2>
					<p class="success-message">{submitResult.message}</p>
				{:else}
					<h2>❌ Error</h2>
					<p class="error-message">{submitResult.message}</p>
					<button type="button" on:click={() => (submitResult = null)} class="retry-button">
						Try Again
					</button>
				{/if}
			{:else}
				<h2 class="review-title">Ready to Submit</h2>
				{#if editingKey}
					<div class="edit-mode" in:fly={{ y: 20, duration: 600, opacity: 0 }}>
						<h3>Edit Response</h3>
						<label for="edit-input" class="label">
							{questions.find((q) => q.key === editingKey)?.label}
						</label>
						<input
							id="edit-input"
							bind:value={input}
							on:keydown={(e) => e.key === 'Enter' && saveEdit()}
						/>
						<div class="edit-buttons">
							<button type="button" on:click={saveEdit} class="save-button"> Save </button>
							<button type="button" on:click={cancelEdit} class="cancel-button"> Cancel </button>
						</div>
					</div>
				{:else}
					<div class="responses">
						{#each questions as question (question.key)}
							{#if answers[question.key]}
								<div class="response-item">
									<div class="response-content">
										<strong>{question.label}:</strong>
										<span>{answers[question.key]}</span>
									</div>
									<button
										type="button"
										on:click={() => editResponse(question.key)}
										class="edit-button"
										title="Edit this response"
									>
										Edit
									</button>
								</div>
							{/if}
						{/each}
					</div>

					<form method="POST" action="?/submit" use:enhance={handleSubmit}>
						<input type="hidden" name="answers" value={JSON.stringify(answers)} />
						<button type="submit" class="submit-button" disabled={submitting}>
							{submitting ? 'Submitting...' : 'Submit Request'}
						</button>
					</form>
				{/if}
			{/if}
		</div>
	{/if}
</div>

<style>
	.typeform {
		position: relative;
		max-width: 700px;
		width: 100%;
		margin: 1rem auto;
		padding: 2.5rem 2rem;
		background: rgba(255, 255, 255, 0.15);
		border-radius: 20px;
		box-shadow: 
			0 8px 32px rgba(184,134,11,0.1),
			0 4px 16px rgba(0, 0, 0, 0.05),
			inset 0 1px 0 rgba(255,255,255,0.3);
		backdrop-filter: blur(15px);
		border: 1px solid rgba(255,255,255,0.2);
		min-height: 400px;
		z-index: 10;
	}
	
	.question {
		width: 100%;
		max-width: 100%;
		text-align: left;
		padding: 2rem 1rem;
		margin-bottom: 1rem;
		transition: all 0.3s ease;
		transform-origin: center;
	}

	.question-number {
		display: inline-block;
		font-size: 1.1rem;
		color: #B8860B;
		margin-right: 0.75rem;
		font-weight: 600;
		background: rgba(184,134,11,0.1);
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		transition: all 0.3s ease;
	}

	.required {
		color: #B8860B;
		margin-left: 0.25rem;
		font-weight: bold;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.6; }
	}

	.label {
		font-size: 1.75rem;
		font-weight: 500;
		color: #333;
		margin-bottom: 1rem;
		line-height: 1.4;
		display: block;
		transition: color 0.3s ease;
	}

	.help {
		font-size: 1.1rem;
		color: #666;
		margin: 0 0 1.5rem 0;
		line-height: 1.5;
		font-style: italic;
	}

	input {
		width: 100%;
		border: none;
		border-radius: 8px;
		font-size: 1.5rem;
		padding: 1rem 1.5rem;
		outline: none;
		background: rgba(255, 255, 255, 0.8);
		margin-bottom: 1.5rem;
		color: #333;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 
			0 4px 15px rgba(184,134,11,0.1),
			inset 0 1px 0 rgba(255,255,255,0.8);
		font-family: 'Montserrat', sans-serif;
		border: 2px solid transparent;
		transform: translateY(0);
	}
	
	input:focus {
		background: rgba(255, 255, 255, 0.95);
		box-shadow: 
			0 8px 30px rgba(184,134,11,0.2),
			inset 0 1px 0 rgba(255,255,255,1);
		border-color: rgba(184,134,11,0.3);
		transform: translateY(-2px) scale(1.01);
	}

	input::placeholder {
		color: #999;
		opacity: 0.7;
		font-size: 1.2rem;
	}
	.ok-button {
		background: linear-gradient(135deg, #B8860B, #DAA520);
		color: white;
		border: none;
		padding: 1rem 2rem;
		font-size: 1.1rem;
		cursor: pointer;
		border-radius: 8px;
		box-shadow: 
			0 4px 15px rgba(184,134,11,0.25),
			inset 0 1px 0 rgba(255,255,255,0.2);
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 1rem;
		transition: all 0.3s ease;
		font-weight: 500;
		letter-spacing: 0.3px;
		font-family: 'Montserrat', sans-serif;
	}
	
	.ok-button:hover {
		background: linear-gradient(135deg, #9B7000, #B8860B);
		box-shadow: 
			0 6px 20px rgba(184,134,11,0.3),
			inset 0 1px 0 rgba(255,255,255,0.3);
		transform: translateY(-2px);
	}
	
	.ok-button:active {
		transform: translateY(0);
		box-shadow: 
			0 3px 10px rgba(184,134,11,0.2),
			inset 0 1px 0 rgba(255,255,255,0.2);
	}
	
	.hint {
		font-size: 0.9rem;
		opacity: 0.8;
		color: rgba(255,255,255,0.9);
		margin-left: 0.5rem;
		font-weight: 300;
	}
	.responses {
		margin-bottom: 2.5rem;
	}
	
	.response-item {
		margin-bottom: 1.25rem;
		padding: 1.25rem;
		background: rgba(255, 255, 255, 0.6);
		border-radius: 12px;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		box-shadow: 
			0 4px 15px rgba(184,134,11,0.08),
			inset 0 1px 0 rgba(255,255,255,0.8);
		backdrop-filter: blur(5px);
		border: 1px solid rgba(184,134,11,0.1);
		transition: all 0.3s ease;
	}
	
	.response-item:hover {
		background: rgba(255, 255, 255, 0.8);
		box-shadow: 
			0 6px 20px rgba(184,134,11,0.12),
			inset 0 1px 0 rgba(255,255,255,1);
		transform: translateY(-1px);
	}
	
	.response-content {
		flex: 1;
		line-height: 1.5;
	}
	
	.response-item strong {
		display: block;
		margin-bottom: 0.5rem;
		color: #B8860B;
		font-weight: 600;
		font-size: 1.1rem;
	}
	
	.response-item span {
		color: #333;
		font-size: 1rem;
		line-height: 1.4;
	}
	
	.edit-button {
		background: linear-gradient(135deg, #6c757d, #545b62);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		cursor: pointer;
		border-radius: 6px;
		margin-left: 1.5rem;
		flex-shrink: 0;
		transition: all 0.3s ease;
		font-weight: 500;
	}
	
	.edit-button:hover {
		background: linear-gradient(135deg, #545b62, #495057);
		transform: translateY(-1px);
		box-shadow: 0 4px 10px rgba(108,117,125,0.2);
	}
	.edit-mode {
		background: #e9ecef;
		padding: 1.5rem;
		border-radius: 8px;
		margin-bottom: 2rem;
	}
	.edit-mode h3 {
		margin: 0 0 1rem 0;
		color: #333;
	}
	.edit-buttons {
		display: flex;
		gap: 0.75rem;
		margin-top: 1rem;
	}
	.save-button {
		background: #28a745;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		cursor: pointer;
		border-radius: 4px;
	}
	.save-button:hover {
		background: #218838;
	}
	.cancel-button {
		background: #6c757d;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		cursor: pointer;
		border-radius: 4px;
	}
	.cancel-button:hover {
		background: #545b62;
	}
	.submit-button {
		background: linear-gradient(135deg, #DAA520, #B8860B);
		color: white;
		border: none;
		padding: 1.5rem 3rem;
		font-size: 1.25rem;
		cursor: pointer;
		border-radius: 8px;
		width: 100%;
		max-width: 400px;
		margin: 2rem auto;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-weight: 500;
		box-shadow: 0 4px 15px rgba(218,165,32,0.2);
	}
	.submit-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(218,165,32,0.3);
		background: linear-gradient(135deg, #B8860B, #DAA520);
	}
	.submit-button:disabled {
		background: #ccc;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}
	
	.review-title {
		font-size: 2rem;
		color: #B8860B;
		margin-bottom: 2rem;
		text-align: center;
		font-weight: 300;
	}
	.retry-button {
		background: #dc3545;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		cursor: pointer;
		border-radius: 4px;
		margin-top: 1rem;
	}
	.retry-button:hover {
		background: #c82333;
	}
	.success-message {
		color: #28a745;
		font-size: 1.1rem;
		margin-bottom: 1rem;
	}
	.error-message {
		color: #dc3545;
		font-size: 1.1rem;
		margin-bottom: 1rem;
	}
</style>
