<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let isOpen = false;
	let messages: Array<{id: string; text: string; sender: 'user' | 'agent'; timestamp: Date}> = [];
	let currentMessage = '';
	let isTyping = false;
	let messagesContainer: HTMLDivElement;

	// Predefined agent responses
	const agentResponses = [
		"Hello! I'm your IT support agent. How can I help you today?",
		"I can help you with IT requests, technical issues, or guide you through our portal.",
		"For urgent IT issues, please submit an IT request through our form.",
		"You can access all Zoho apps from our portal's main page.",
		"Is there anything specific you'd like to know about our IT services?",
		"I'm here to assist you with any technical questions or concerns.",
		"Would you like me to help you navigate to a specific section of the portal?"
	];

	function toggleChat() {
		isOpen = !isOpen;
		if (isOpen && messages.length === 0) {
			// Initial greeting when chat opens for the first time
			setTimeout(() => {
				addAgentMessage("Hello! I'm your IT support agent. How can I help you today?");
			}, 500);
		}
	}

	function sendMessage() {
		if (currentMessage.trim() === '') return;

		// Add user message
		const userMsg = {
			id: Date.now().toString(),
			text: currentMessage,
			sender: 'user' as const,
			timestamp: new Date()
		};
		messages = [...messages, userMsg];
		currentMessage = '';

		// Scroll to bottom
		setTimeout(scrollToBottom, 100);

		// Show typing indicator and respond
		isTyping = true;
		setTimeout(() => {
			isTyping = false;
			addAgentMessage(getAgentResponse(userMsg.text));
		}, 1500);
	}

	function addAgentMessage(text: string) {
		const agentMsg = {
			id: Date.now().toString(),
			text,
			sender: 'agent' as const,
			timestamp: new Date()
		};
		messages = [...messages, agentMsg];
		setTimeout(scrollToBottom, 100);
	}

	function getAgentResponse(userText: string): string {
		const text = userText.toLowerCase();
		
		if (text.includes('help') || text.includes('support')) {
			return "I'm here to help! You can submit IT requests, access Zoho apps, or ask me about our services. What do you need assistance with?";
		} else if (text.includes('it request') || text.includes('request')) {
			return "To submit an IT request, click on 'IT Request' in the navigation menu. I can guide you through the process if needed.";
		} else if (text.includes('zoho') || text.includes('apps')) {
			return "You can access all Zoho applications from our main portal page. We have Mail, People, Projects, CRM, WorkDrive, Cliq, Books, and Calendar available.";
		} else if (text.includes('email') || text.includes('mail')) {
			return "For email-related issues, you can access Zoho Mail or contact our IT team at ithelpdesk@nationalgroupindia.com";
		} else if (text.includes('contact') || text.includes('phone')) {
			return "You can reach our IT support team at ithelpdesk@nationalgroupindia.com or visit the Contact page for more information.";
		} else if (text.includes('thank') || text.includes('thanks')) {
			return "You're welcome! Is there anything else I can help you with today?";
		} else if (text.includes('bye') || text.includes('goodbye')) {
			return "Goodbye! Feel free to reach out anytime you need IT support. Have a great day!";
		} else {
			return agentResponses[Math.floor(Math.random() * agentResponses.length)];
		}
	}

	function scrollToBottom() {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			sendMessage();
		}
	}

	function loadAllMessages() {
		// Simulate loading all messages
		addAgentMessage("Here are some things I can help you with:\n\n• Submit IT requests\n• Access Zoho applications\n• Technical support\n• Portal navigation\n• Contact information\n\nWhat would you like to know more about?");
	}
</script>

<!-- Chat Widget -->
<div class="chat-widget">
	<!-- Chat Button -->
	{#if !isOpen}
		<button class="chat-toggle" on:click={toggleChat} title="IT Support Agent">
			💬
		</button>
	{/if}

	<!-- Chat Window -->
	{#if isOpen}
		<div class="chat-window" transition:fly={{ y: 20, duration: 300 }}>
			<!-- Chat Header -->
			<div class="chat-header">
				<div class="agent-info">
					<div class="agent-avatar">🤖</div>
					<div class="agent-details">
						<div class="agent-name">IT Support Agent</div>
						<div class="agent-status">Online</div>
					</div>
				</div>
				<div class="chat-controls">
					<button class="load-messages-btn" on:click={loadAllMessages} title="Load all messages">
						📥
					</button>
					<button class="close-chat" on:click={toggleChat}>✕</button>
				</div>
			</div>

			<!-- Messages Container -->
			<div class="messages-container" bind:this={messagesContainer}>
				{#each messages as message (message.id)}
					<div class="message {message.sender}" transition:fade={{ duration: 300 }}>
						<div class="message-bubble">
							{message.text}
						</div>
						<div class="message-time">
							{message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
						</div>
					</div>
				{/each}

				{#if isTyping}
					<div class="message agent typing" transition:fade={{ duration: 200 }}>
						<div class="message-bubble">
							<div class="typing-indicator">
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Message Input -->
			<div class="message-input">
				<input
					type="text"
					bind:value={currentMessage}
					on:keypress={handleKeyPress}
					placeholder="Type your message..."
					class="input-field"
				/>
				<button on:click={sendMessage} class="send-button" disabled={!currentMessage.trim()}>
					🚀
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.chat-widget {
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 1000;
		font-family: 'Montserrat', sans-serif;
	}

	.chat-toggle {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: linear-gradient(135deg, #B8860B, #DAA520);
		border: none;
		color: white;
		font-size: 24px;
		cursor: pointer;
		box-shadow: 
			0 8px 25px rgba(184,134,11,0.3),
			0 4px 15px rgba(0,0,0,0.1);
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.chat-toggle:hover {
		transform: translateY(-2px) scale(1.05);
		box-shadow: 
			0 12px 35px rgba(184,134,11,0.4),
			0 6px 20px rgba(0,0,0,0.15);
	}

	.chat-window {
		width: 350px;
		height: 500px;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(15px);
		border-radius: 20px;
		box-shadow: 
			0 25px 50px rgba(0,0,0,0.15),
			0 8px 25px rgba(184,134,11,0.1),
			inset 0 1px 0 rgba(255,255,255,0.8);
		border: 1px solid rgba(184,134,11,0.1);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.chat-header {
		background: linear-gradient(135deg, #B8860B, #DAA520);
		color: white;
		padding: 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2px 10px rgba(184,134,11,0.2);
	}

	.agent-info {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.agent-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(255,255,255,0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
	}

	.agent-name {
		font-weight: 600;
		font-size: 14px;
	}

	.agent-status {
		font-size: 12px;
		opacity: 0.9;
	}

	.chat-controls {
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.load-messages-btn, .close-chat {
		background: rgba(255,255,255,0.2);
		border: none;
		color: white;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		transition: all 0.2s ease;
	}

	.load-messages-btn:hover, .close-chat:hover {
		background: rgba(255,255,255,0.3);
		transform: scale(1.1);
	}

	.messages-container {
		flex: 1;
		padding: 15px;
		overflow-y: auto;
		scroll-behavior: smooth;
	}

	.message {
		margin-bottom: 15px;
		display: flex;
		flex-direction: column;
	}

	.message.user {
		align-items: flex-end;
	}

	.message.agent {
		align-items: flex-start;
	}

	.message-bubble {
		max-width: 80%;
		padding: 12px 16px;
		border-radius: 18px;
		word-wrap: break-word;
		line-height: 1.4;
		white-space: pre-line;
	}

	.message.user .message-bubble {
		background: linear-gradient(135deg, #B8860B, #DAA520);
		color: white;
		border-bottom-right-radius: 5px;
	}

	.message.agent .message-bubble {
		background: rgba(240, 240, 240, 0.9);
		color: #333;
		border-bottom-left-radius: 5px;
	}

	.message-time {
		font-size: 11px;
		color: #999;
		margin-top: 4px;
		margin-left: 8px;
		margin-right: 8px;
	}

	.typing-indicator {
		display: flex;
		gap: 4px;
		align-items: center;
	}

	.typing-indicator span {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #B8860B;
		animation: typing 1.4s infinite ease-in-out;
	}

	.typing-indicator span:nth-child(1) { animation-delay: 0s; }
	.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
	.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

	@keyframes typing {
		0%, 60%, 100% { transform: scale(1); opacity: 0.5; }
		30% { transform: scale(1.2); opacity: 1; }
	}

	.message-input {
		padding: 15px;
		border-top: 1px solid rgba(184,134,11,0.1);
		background: rgba(255,255,255,0.5);
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.input-field {
		flex: 1;
		padding: 12px 15px;
		border: 2px solid rgba(184,134,11,0.2);
		border-radius: 25px;
		outline: none;
		font-size: 14px;
		background: rgba(255,255,255,0.9);
		transition: all 0.3s ease;
	}

	.input-field:focus {
		border-color: #B8860B;
		box-shadow: 0 0 10px rgba(184,134,11,0.2);
	}

	.send-button {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, #B8860B, #DAA520);
		border: none;
		color: white;
		font-size: 16px;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.send-button:hover:not(:disabled) {
		transform: scale(1.1);
		box-shadow: 0 4px 15px rgba(184,134,11,0.3);
	}

	.send-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	/* Scrollbar styling */
	.messages-container::-webkit-scrollbar {
		width: 6px;
	}

	.messages-container::-webkit-scrollbar-track {
		background: rgba(240, 240, 240, 0.5);
		border-radius: 3px;
	}

	.messages-container::-webkit-scrollbar-thumb {
		background: rgba(184,134,11,0.5);
		border-radius: 3px;
	}

	.messages-container::-webkit-scrollbar-thumb:hover {
		background: rgba(184,134,11,0.7);
	}
</style>
