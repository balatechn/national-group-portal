<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	// Logo image path
	const logoPath = '/logo.png';
	
	let puzzleSolved = false;
	let attempts = 0;
	let showHint = false;
	
	// Fun Tom & Jerry cartoon puzzles
	const puzzles = [
		{
			question: "🐱 Tom caught 3 mice, then Jerry freed 1. How many mice does Tom still have?",
			answer: 2,
			hint: "Tom had 3 mice, Jerry freed 1: 3 - 1 = ?"
		},
		{
			question: "🧀 Jerry found 5 cheese pieces, ate 2, and hid 1. How many cheese pieces are left for Tom to find?",
			answer: 2,
			hint: "Jerry had 5, ate 2, hid 1: 5 - 2 - 1 = ?"
		},
		{
			question: "🐱 Tom chased Jerry 4 times around the house, then 3 more times. How many chases total?",
			answer: 7,
			hint: "4 chases + 3 more chases = ?"
		},
		{
			question: "🕳️ Jerry made 6 holes in the wall, Tom blocked 2. How many holes are still open?",
			answer: 4,
			hint: "6 holes - 2 blocked = ?"
		},
		{
			question: "🐱🐭 If Tom catches Jerry 2 times but Jerry escapes 2 times, how many times is Jerry still free?",
			answer: 2,
			hint: "Jerry escaped every time he was caught: 2 escapes!"
		}
	];
	
	const currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
	let userAnswer = '';
	let feedback = '';
	
	function checkAnswer() {
		attempts++;
		const answer = parseInt(userAnswer);
		
		if (answer === currentPuzzle.answer) {
			puzzleSolved = true;
			feedback = "🎉 Excellent! Tom and Jerry welcome you to National Group! 🐱🐭";
			setTimeout(() => {
				dispatch('solved');
			}, 2000);
		} else {
			feedback = "❌ Oops! Tom says try again! Jerry believes in you! 😊";
			if (attempts >= 2) {
				showHint = true;
			}
		}
		userAnswer = '';
	}
	
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			checkAnswer();
		}
	}
</script>

<div class="puzzle-overlay">
	<div class="puzzle-container">
		<div class="logo-container">
			<img src={logoPath} alt="Logo" width="100" />
		</div>
		
		<div class="puzzle-header">
			<h1>🐱🐭 Tom & Jerry Puzzle Challenge 🧀</h1>
			<p class="portal-text">Welcome to <span class="brand-text">National Group Portal</span></p>
			<p class="sub-text">Help Tom and Jerry solve this puzzle to enter!</p>
		</div>
		
		<div class="puzzle-content">
			<div class="question-box">
				<h2>{currentPuzzle.question}</h2>
			</div>
			
			<div class="answer-section">
				<input 
					type="number" 
					bind:value={userAnswer} 
					placeholder="Enter your answer..."
					on:keypress={handleKeyPress}
					class="answer-input"
				/>
				<button on:click={checkAnswer} class="submit-btn">
					🚀 Submit
				</button>
			</div>
			
			{#if feedback}
				<div class="feedback {puzzleSolved ? 'success' : 'error'}">
					{feedback}
				</div>
			{/if}
			
			{#if showHint && !puzzleSolved}
				<div class="hint">
					💡 Hint: {currentPuzzle.hint}
				</div>
			{/if}
			
			<div class="attempts">
				Attempts: {attempts}/3
			</div>
		</div>
		
		<div class="cartoon-characters">
			<div class="character bounce tom">🐱</div>
			<div class="character run jerry">🐭</div>
			<div class="character wiggle cheese">🧀</div>
			<div class="character float hole">�️</div>
			<div class="character spin chase">💨</div>
			<div class="character pulse trap">�</div>
		</div>
	</div>
</div>

<style>
	.puzzle-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: linear-gradient(135deg, 
			rgba(184,134,11,0.95) 0%, 
			rgba(218,165,32,0.98) 35%, 
			rgba(205,133,63,0.96) 70%, 
			rgba(160,102,8,0.95) 100%);
		backdrop-filter: blur(10px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.8s ease-in-out;
	}
	
	.puzzle-container {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(15px);
		border-radius: 25px;
		padding: 45px;
		max-width: 550px;
		width: 90%;
		box-shadow: 
			0 25px 50px rgba(0,0,0,0.15),
			0 8px 20px rgba(184,134,11,0.2),
			inset 0 1px 0 rgba(255,255,255,0.8);
		text-align: center;
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(184,134,11,0.1);
	}
	
	.puzzle-container::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: linear-gradient(45deg, 
			transparent, 
			rgba(184,134,11,0.05), 
			transparent);
		animation: shimmer 4s linear infinite;
	}
	
	.logo-container {
		margin-bottom: 25px;
		display: flex;
		justify-content: center;
	}
	
	.logo-container img {
		filter: drop-shadow(0 6px 12px rgba(184,134,11,0.25));
		transition: transform 0.3s ease;
	}
	
	.logo-container img:hover {
		transform: scale(1.05);
	}
	
	.puzzle-header h1 {
		color: #B8860B;
		font-size: 32px;
		margin-bottom: 15px;
		text-shadow: 2px 2px 8px rgba(184,134,11,0.3);
		font-family: 'Montserrat', 'Segoe UI', sans-serif;
		font-weight: 600;
		letter-spacing: 0.5px;
	}
	
	.portal-text {
		font-size: 20px;
		color: #666;
		margin-bottom: 8px;
		font-weight: 400;
	}
	
	.brand-text {
		font-size: 26px;
		font-weight: 700;
		color: #B8860B;
		text-shadow: 1px 1px 4px rgba(184,134,11,0.2);
		font-family: 'Montserrat Light', 'Montserrat', sans-serif;
		letter-spacing: 1px;
		display: inline-block;
		background: linear-gradient(135deg, #B8860B, #DAA520);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.sub-text {
		color: #888;
		font-size: 16px;
		margin-bottom: 25px;
		font-style: italic;
	}
	
	.question-box {
		background: linear-gradient(135deg, 
			rgba(184,134,11,0.95) 0%, 
			rgba(218,165,32,0.9) 100%);
		padding: 25px;
		border-radius: 18px;
		margin-bottom: 30px;
		color: white;
		font-size: 19px;
		line-height: 1.6;
		box-shadow: 
			0 8px 25px rgba(184,134,11,0.3),
			inset 0 1px 0 rgba(255,255,255,0.2);
		border: 1px solid rgba(255,255,255,0.1);
		font-weight: 500;
		letter-spacing: 0.3px;
	}
	
	.answer-section {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
	}
	
	.answer-input {
		flex: 1;
		padding: 15px;
		border: 2px solid rgba(184,134,11,0.3);
		border-radius: 12px;
		font-size: 17px;
		text-align: center;
		background: rgba(255,255,255,0.9);
		backdrop-filter: blur(5px);
		transition: all 0.3s ease;
		font-weight: 500;
	}
	
	.answer-input:focus {
		outline: none;
		border-color: #B8860B;
		box-shadow: 0 0 15px rgba(184,134,11,0.25);
		background: rgba(255,255,255,1);
		transform: translateY(-1px);
	}
	
	.submit-btn {
		padding: 15px 25px;
		background: linear-gradient(135deg, #B8860B, #DAA520);
		color: white;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		font-size: 17px;
		font-weight: 600;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(184,134,11,0.3);
		letter-spacing: 0.5px;
	}
	
	.submit-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(184,134,11,0.4);
	}
	
	.feedback {
		padding: 15px;
		border-radius: 10px;
		margin-bottom: 15px;
		font-weight: bold;
		font-size: 18px;
	}
	
	.feedback.success {
		background: linear-gradient(135deg, #228B22 0%, #32CD32 100%);
		color: white;
		animation: pulse 0.5s ease-in-out;
	}
	
	.feedback.error {
		background: linear-gradient(135deg, #CD853F 0%, #D2691E 100%);
		color: white;
	}
	
	.hint {
		background: linear-gradient(135deg, #F5DEB3 0%, #DEB887 100%);
		padding: 10px;
		border-radius: 8px;
		margin-bottom: 15px;
		color: #8B4513;
		font-style: italic;
		border: 2px solid #B8860B;
	}
	
	.attempts {
		color: #666;
		font-size: 14px;
	}
	
	.cartoon-characters {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: -1;
	}
	
	.character {
		position: absolute;
		font-size: 35px;
		opacity: 0.15;
		transition: opacity 0.3s ease;
	}
	
	.character:nth-child(1) { top: 15%; left: 8%; }   /* Tom */
	.character:nth-child(2) { top: 25%; right: 12%; } /* Jerry */
	.character:nth-child(3) { bottom: 25%; left: 15%; } /* Cheese */
	.character:nth-child(4) { bottom: 15%; right: 8%; } /* Hole */
	.character:nth-child(5) { top: 45%; left: 3%; }    /* Chase */
	.character:nth-child(6) { top: 60%; right: 5%; }   /* Trap */
	
	.tom { 
		animation: bounce 2s infinite;
		font-size: 40px;
	}
	
	.jerry { 
		animation: run 3s ease-in-out infinite;
		font-size: 32px;
	}
	
	.cheese { 
		animation: wiggle 2s ease-in-out infinite;
		opacity: 0.2;
	}
	
	.hole { 
		animation: float 4s ease-in-out infinite;
		opacity: 0.1;
	}
	
	.chase { 
		animation: spin 2s linear infinite;
		font-size: 28px;
	}
	
	.trap { 
		animation: pulse 3s ease-in-out infinite;
		opacity: 0.12;
	}
	
	@keyframes fadeIn {
		from { 
			opacity: 0; 
			transform: scale(0.9) translateY(20px); 
		}
		to { 
			opacity: 1; 
			transform: scale(1) translateY(0); 
		}
	}
	
	@keyframes shimmer {
		0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
		100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
	}
	
	@keyframes run {
		0%, 100% { transform: translateX(0px) scale(1); }
		25% { transform: translateX(5px) scale(1.1); }
		50% { transform: translateX(-3px) scale(0.9); }
		75% { transform: translateX(8px) scale(1.05); }
	}
	
	@keyframes bounce {
		0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
		40% { transform: translateY(-10px); }
		60% { transform: translateY(-5px); }
	}
	
	@keyframes wiggle {
		0%, 100% { transform: rotate(0deg); }
		25% { transform: rotate(5deg); }
		75% { transform: rotate(-5deg); }
	}
	
	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-8px); }
	}
	
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	
	@keyframes pulse {
		0% { transform: scale(1); }
		50% { transform: scale(1.05); }
		100% { transform: scale(1); }
	}
	
	.bounce { animation: bounce 2s infinite; }
	.run { animation: run 3s ease-in-out infinite; }
	.wiggle { animation: wiggle 1s ease-in-out infinite; }
	.float { animation: float 3s ease-in-out infinite; }
	.spin { animation: spin 4s linear infinite; }
	.pulse { animation: pulse 2s ease-in-out infinite; }
</style>