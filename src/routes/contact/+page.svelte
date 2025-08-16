<script lang="ts">
	import ChatAgent from '$lib/ChatAgent.svelte';
	
	// Logo image path
	const logoPath = '/logo.png';
</script>

<div class="header-container">
	<div class="logo-container">
		<img src={logoPath} alt="Logo" width="120" />
	</div>

	<nav class="navigation">
		<a href="/home" class="nav-link">Home</a>
		<a href="/request" class="nav-link">IT Request</a>
		<a href="/contact" class="nav-link active">Contact</a>
	</nav>
</div>

<div class="content-container">
	<h1>Contact IT Support</h1>
	<div class="contact-info">
		<p class="subtitle">IT Help Desk Support</p>
		<a href="mailto:ithelpdesk@nationalgroupindia.com" class="email-button">
			ithelpdesk@nationalgroupindia.com
		</a>
		<p class="help-text">For any IT-related queries or support, please email us at the above address.</p>
	</div>
</div>

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

	.content-container {
		margin-top: 180px;
		padding: 20px;
		text-align: center;
	}

	h1 {
		color: #B8860B;
		font-size: 38px;
		font-weight: bold;
		margin-bottom: 10px;
		font-family: 'Montserrat Light', 'Montserrat', sans-serif;
		text-shadow: 2px 2px 4px rgba(184,134,11,0.2);
	}

	.contact-info {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
	}

	.subtitle {
		color: #666;
		font-size: 24px;
		margin-bottom: 30px;
	}

	.email-button {
		display: inline-block;
		background: linear-gradient(135deg, #B8860B, #DAA520);
		color: white;
		padding: 20px 40px;
		border-radius: 8px;
		text-decoration: none;
		font-size: 20px;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		box-shadow: 0 4px 6px rgba(184,134,11,0.1);
		margin-bottom: 30px;
	}

	.email-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(184,134,11,0.2);
	}

	.help-text {
		color: #666;
		font-size: 18px;
		line-height: 1.6;
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
