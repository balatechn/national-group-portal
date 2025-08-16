<script lang="ts">
	import Typeform from '$lib/Typeform.svelte';
	import ChatAgent from '$lib/ChatAgent.svelte';
	import type { ActionData } from './$types.js';

	export let form: ActionData;

	// Logo image path
	const logoPath = '/logo.png';
	
	const questions = [
		{
		key: 'requestedBy',
        label: 'Requested By',
        help: 'Name of the person making the request',
        placeholder: 'Enter your name...',
        required: true
		},
		{
			key: 'dateOfRequest',
			label: 'Date of Request',
			help: 'Enter the date when this request is being made',
			placeholder: 'DD/MM/YYYY',
			required: true
		},
		{
			key: 'typeOfSystem',
			label: 'Type of System',
			help: 'Select the type of system required',
			placeholder: 'Laptop, Desktop, Email, or Other',
			required: true
		},
		{
			key: 'quantity',
			label: 'Quantity',
			help: 'Number of items required',
			placeholder: 'Enter quantity...',
			required: true
		},
		{
			key: 'model',
			label: 'Model',
			help: 'Specify the model if known',
			placeholder: 'Enter model details...',
			required: false
		},
		{
			key: 'proposedConfiguration',
			label: 'Proposed Configuration',
			help: 'Describe the proposed configuration or specifications',
			placeholder: 'Enter configuration details...',
			required: false
		},
		{
			key: 'purposeOfRequest',
			label: 'Purpose of Request',
			help: 'Is this for a new employee or existing employee?',
			placeholder: 'New Employee or Existing',
			required: true
		},
		{
			key: 'usernameDesignation',
			label: 'Username & Designation',
			help: 'Enter the username and job designation',
			placeholder: 'Username and job title...',
			required: true
		},
		{
			key: 'emailIdRequest',
			label: 'Email ID Request',
			help: 'Email address for this request',
			placeholder: 'Enter email address...',
			required: false
		},
		{
			key: 'dateOfJoining',
			label: 'Date of Joining',
			help: 'Date when the employee joined or will join',
			placeholder: 'DD/MM/YYYY',
			required: false
		}
	];
</script>

<div class="header-container">
	<div class="logo-container">
		<img src={logoPath} alt="Logo" width="120" />
	</div>

	<nav class="navigation">
		<a href="/home" class="nav-link">Home</a>
		<a href="/request" class="nav-link active">IT Request</a>
		<a href="/contact" class="nav-link">Contact</a>
	</nav>

	<h1 class="page-title">IT Request</h1>
</div>

<div class="content-container">
	<Typeform {questions} {form} />
</div>

<style>
	.header-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(15px);
		z-index: 1000;
		padding: 15px;
		box-shadow: 
			0 8px 25px rgba(184,134,11,0.15),
			0 4px 15px rgba(0,0,0,0.05),
			inset 0 1px 0 rgba(255,255,255,0.8);
		display: flex;
		flex-direction: column;
		align-items: center;
		border-bottom: 1px solid rgba(184,134,11,0.1);
		min-height: 190px;
		transform: translateZ(0);
	}
	
	.header-container::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: linear-gradient(45deg, 
			transparent, 
			rgba(184,134,11,0.03), 
			transparent);
		animation: shimmer 6s linear infinite;
		z-index: -1;
	}

	.logo-container {
		display: flex;
		justify-content: center;
		margin: 0 auto;
		padding: 12px 0;
	}
	
	.logo-container img {
		filter: drop-shadow(0 6px 12px rgba(184,134,11,0.25));
		transition: transform 0.3s ease;
	}
	
	.logo-container img:hover {
		transform: scale(1.05);
	}

	.navigation {
		display: flex;
		gap: 25px;
		margin-top: 12px;
		margin-bottom: 15px;
	}

	.nav-link {
		color: #B8860B;
		text-decoration: none;
		font-size: 18px;
		font-weight: 500;
		padding: 8px 18px;
		border-radius: 12px;
		transition: all 0.3s ease;
		letter-spacing: 0.3px;
		position: relative;
		background: rgba(255,255,255,0.3);
		backdrop-filter: blur(5px);
		border: 1px solid rgba(184,134,11,0.1);
	}

	.nav-link:hover, .nav-link.active {
		background: linear-gradient(135deg, rgba(184,134,11,0.15), rgba(218,165,32,0.1));
		transform: translateY(-1px);
		box-shadow: 0 4px 15px rgba(184,134,11,0.2);
	}
	
	.page-title {
		color: #B8860B;
		font-size: 32px;
		font-weight: 600;
		margin: 15px 0 10px 0;
		font-family: 'Montserrat Light', 'Montserrat', sans-serif;
		text-shadow: 2px 2px 8px rgba(184,134,11,0.2);
		background: linear-gradient(135deg, #B8860B, #DAA520);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: 0.5px;
	}

	.content-container {
		margin-top: 200px;
		padding: 20px 20px 40px 20px;
		min-height: calc(100vh - 200px);
		background: rgba(255,255,255,0.05);
		backdrop-filter: blur(5px);
		position: relative;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
		box-sizing: border-box;
	}
	
	.content-container::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: linear-gradient(45deg, 
			transparent, 
			rgba(184,134,11,0.02), 
			transparent);
		animation: shimmer 8s linear infinite;
		z-index: -1;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		min-height: 100vh;
		background: linear-gradient(135deg, 
			rgba(255,255,255,0.98) 0%, 
			rgba(255,248,220,0.96) 35%, 
			rgba(255,253,245,0.97) 70%, 
			rgba(255,255,255,0.98) 100%), 
		linear-gradient(135deg, 
			rgba(184,134,11,0.03), 
			rgba(218,165,32,0.02));
		background-attachment: fixed;
		font-family: 'Montserrat', sans-serif;
		backdrop-filter: blur(5px);
		overflow-x: hidden;
		position: relative;
	}

	:global(html) {
		scroll-behavior: smooth;
		overflow-x: hidden;
	}

	:global(*) {
		box-sizing: border-box;
	}
	
	@keyframes shimmer {
		0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
		100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
	}
</style>

<!-- Chat Agent Widget -->
<ChatAgent />
```
