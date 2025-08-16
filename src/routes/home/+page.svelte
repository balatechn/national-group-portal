<script lang="ts">
	// Logo image path
	const logoPath = '/logo.png';
	import ChatAgent from '$lib/ChatAgent.svelte';

	const zohoApps = [
		{ name: 'Zoho Mail', url: 'https://accounts.zoho.in/signin?servicename=VirtualOffice' },
		{ name: 'Zoho People', url: 'https://accounts.zoho.in/signin?servicename=ZohoPeople' },
		{ name: 'Zoho Project', url: 'https://accounts.zoho.in/signin?servicename=ZohoProjects' },
		{ name: 'Zoho CRM', url: 'https://accounts.zoho.in/signin?servicename=ZohoCRM' },
		{ name: 'Zoho WorkDrive', url: 'https://accounts.zoho.in/signin?servicename=ZohoWorkDrive' },
		{ name: 'Zoho Cliq', url: 'https://accounts.zoho.in/signin?servicename=ZohoChat' },
		{ name: 'Zoho Books', url: 'https://accounts.zoho.in/signin?servicename=ZohoBooks' },
		{ name: 'Zoho Calendar', url: 'https://accounts.zoho.in/signin?servicename=ZohoCalendar' }
	];

	// Zoho Cliq Widget Configuration
	import { onMount } from 'svelte';

	onMount(() => {
		// Add Zoho Cliq Widget Script
		const script = document.createElement('script');
		script.src = 'https://cliq.zoho.in/widget';
		script.async = true;
		script.defer = true;
		
		// Initialize Zoho Cliq Widget
		script.onload = () => {
			// @ts-ignore
			window.$zoho = window.$zoho || {};
			// @ts-ignore
			window.$zoho.cliq = window.$zoho.cliq || {};
			// @ts-ignore
			window.$zoho.cliq.widget = {
				// Replace with your Zoho Cliq Organization Key
				organization: 'YOUR_ORGANIZATION_KEY',
				// Customize widget appearance
				options: {
					position: 'right',
					launcher: {
						style: 'square', // or 'circle'
						color: '#B8860B'
					},
					theme: 'light',
					size: 'large',
					// Customize welcome message
					welcomeText: 'Hello! How can we help you today?'
				}
			};
		};

		document.body.appendChild(script);

		return () => {
			// Cleanup when component unmounts
			document.body.removeChild(script);
		};
	});
</script>

<div class="header-container">
	<div class="logo-container">
		<img src={logoPath} alt="Logo" width="120" />
	</div>

	<nav class="navigation">
		<a href="/home" class="nav-link active">Home</a>
		<a href="/request" class="nav-link">IT Request</a>
		<a href="/contact" class="nav-link">Contact</a>
	</nav>
</div>

<section class="hero">
	<div class="hero-inner">
		<h1 class="hero-title">Work. Faster. Together.</h1>
		<p class="hero-text">Your internal hub for tools, requests, and support — all in one place.</p>
		<div class="hero-ctas">
			<a href="/request" class="btn btn-primary">Submit IT Request</a>
			<a href="#apps" class="btn btn-outline">Open Zoho Apps</a>
			<a href="/contact" class="btn btn-link">Contact IT</a>
		</div>
	</div>
	<div class="hero-accent" aria-hidden="true"></div>
	<div class="hero-blur" aria-hidden="true"></div>
	<div class="hero-gradient" aria-hidden="true"></div>
	<div class="hero-bottom-fade" aria-hidden="true"></div>
    
</section>

<section id="apps" class="apps-section">
	<div class="section-header">
		<h2>Quick links</h2>
		<p>Jump straight into the apps you use every day.</p>
	</div>

	<div class="app-grid">
		{#each zohoApps as app}
			<a href={app.url} target="_blank" rel="noopener noreferrer" class="app-button">
				{app.name}
			</a>
		{/each}
	</div>
</section>

<style>
	.header-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,253,245,0.95));
		backdrop-filter: blur(8px);
		z-index: 100;
		padding: 12px;
		box-shadow: 0 4px 30px rgba(218,165,32,0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.logo-container {
		display: flex;
		justify-content: center;
		margin: 0 auto;
		padding: 10px 0;
	}

	.navigation {
		display: flex;
		gap: 20px;
		margin-top: 10px;
	}

	.nav-link {
		color: #B8860B;
		text-decoration: none;
		font-size: 18px;
		padding: 5px 15px;
		border-radius: 4px;
		transition: all 0.3s ease;
	}

	.nav-link:hover, .nav-link.active {
		background-color: rgba(184,134,11,0.1);
	}

	/* Hero */
	.hero {
		margin-top: 160px; /* below fixed header */
		position: relative;
		min-height: calc(100vh - 160px);
		display: grid;
		place-items: center;
		overflow: hidden;
		text-align: center;
	}

	.hero-inner {
		position: relative;
		z-index: 2;
		max-width: 1000px;
		padding: 0 24px;
	}

	.hero-title {
		font-family: 'Montserrat Light', 'Montserrat', sans-serif;
		font-weight: 800;
		letter-spacing: -0.02em;
		font-size: clamp(36px, 6vw, 72px);
		line-height: 1.05;
		margin: 0 0 14px;
		color: #1b1b1b;
		text-shadow: 2px 2px 4px rgba(184,134,11,0.12);
	}

	.hero-text {
		color: #444;
		font-size: clamp(16px, 2vw, 22px);
		margin: 0 auto 28px;
		max-width: 720px;
	}

	.hero-ctas {
		display: inline-flex;
		gap: 14px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		padding: 14px 20px;
		font-weight: 600;
		text-decoration: none;
		transition: transform .2s ease, box-shadow .2s ease, background-color .2s ease, color .2s ease;
		will-change: transform;
		border: 1px solid transparent;
	}
	.btn:hover { transform: translateY(-2px); }

	.btn-primary {
		background: linear-gradient(135deg, #B8860B, #DAA520);
		color: #fff;
		box-shadow: 0 6px 18px rgba(184,134,11,0.25);
	}
	.btn-primary:hover { box-shadow: 0 10px 24px rgba(184,134,11,0.35); }

	.btn-outline {
		background: rgba(255,255,255,0.7);
		color: #B8860B;
		border-color: rgba(184,134,11,0.35);
	}
	.btn-outline:hover {
		background: rgba(255,255,255,0.9);
		border-color: rgba(184,134,11,0.6);
	}

	.btn-link { color: #7a6008; text-decoration: underline; }

	/* Decorative hero elements */
	.hero-accent {
		position: absolute;
		inset: -40% -20% auto -20%;
		height: 80%;
		background: radial-gradient(75% 60% at 50% 40%, rgba(218,165,32,0.12), rgba(218,165,32,0) 70%);
		z-index: 0;
		pointer-events: none;
	}
	.hero-blur {
		position: absolute;
		width: 540px; height: 540px;
		right: -160px; top: -80px;
		background: radial-gradient(closest-side, rgba(184,134,11,0.25), rgba(184,134,11,0));
		filter: blur(40px);
		z-index: 0;
	}
	.hero-gradient {
		position: absolute; inset: 0;
		background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,253,245,0.55) 60%, rgba(255,248,220,0.85) 100%);
		z-index: 1;
		pointer-events: none;
	}
	.hero-bottom-fade {
		position: absolute; inset: auto 0 0 0; height: 120px;
		background: linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,1));
		z-index: 1;
	}

	/* Apps section */
	.apps-section {
		position: relative;
		padding: 24px;
		margin: 0 auto 60px;
		max-width: 1200px;
		text-align: center;
	}
	.section-header h2 {
		margin: 0 0 6px;
		font-size: clamp(24px, 4vw, 36px);
		color: #B8860B;
		text-shadow: 1px 1px 2px rgba(184,134,11,0.15);
		font-family: 'Montserrat Light', 'Montserrat', sans-serif;
	}
	.section-header p { color: #666; margin: 0 0 18px; }

	.app-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 18px;
		max-width: 1100px;
		margin: 10px auto 0;
		padding: 10px;
	}

	.app-button {
		background: linear-gradient(135deg, #B8860B, #DAA520);
		color: white;
		padding: 18px 20px;
		border-radius: 12px;
		text-decoration: none;
		font-size: 18px;
		transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
		box-shadow: 0 6px 14px rgba(184,134,11,0.18);
	}

	.app-button:hover {
		transform: translateY(-3px);
		box-shadow: 0 12px 24px rgba(184,134,11,0.28);
	}

	:global(body) {
		margin: 0;
		padding: 0;
		min-height: 100vh;
		background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,248,220,0.95)), 
					linear-gradient(135deg, rgba(218,165,32,0.1), rgba(255,215,0,0.05));
		background-attachment: fixed;
		font-family: 'Montserrat', sans-serif;
	}

	:global(*) {
		box-sizing: border-box;
	}
</style>

<!-- Chat Agent Widget -->
<ChatAgent />
