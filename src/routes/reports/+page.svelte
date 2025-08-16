<script lang="ts">
	import type { PageData } from './$types.js';

	export let data: PageData;

	// Logo image path
	const logoPath = '/logo.png';

	let searchTerm = '';
	let statusFilter = 'all';
	let sortBy = 'date';

	$: filteredRequests = data.requests.filter(request => {
		const matchesSearch = 
			request.requisitionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
			request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
			request.typeOfSystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
			request.purposeOfRequest.toLowerCase().includes(searchTerm.toLowerCase());
		
		return matchesSearch;
	});

	$: sortedRequests = [...filteredRequests].sort((a, b) => {
		switch (sortBy) {
			case 'date':
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			case 'code':
				return a.requisitionCode.localeCompare(b.requisitionCode);
			case 'name':
				return a.requestedBy.localeCompare(b.requestedBy);
			case 'type':
				return a.typeOfSystem.localeCompare(b.typeOfSystem);
			default:
				return 0;
		}
	});

	function getStatusBadge(request: any) {
		// Simple status based on creation date (you can enhance this logic)
		const daysSinceCreated = Math.floor(
			(Date.now() - new Date(request.createdAt).getTime()) / (1000 * 60 * 60 * 24)
		);
		
		if (daysSinceCreated < 1) return { text: 'New', class: 'status-new' };
		if (daysSinceCreated < 7) return { text: 'Pending', class: 'status-pending' };
		return { text: 'In Review', class: 'status-review' };
	}

	function exportToCSV() {
		const headers = [
			'Requisition Code',
			'Date Requested',
			'Type of System',
			'Quantity',
			'Model',
			'Requested By',
			'Purpose',
			'Username/Designation',
			'Email',
			'Date of Joining',
			'Created At'
		];

		const csvContent = [
			headers.join(','),
			...sortedRequests.map(request => [
				request.requisitionCode,
				request.dateOfRequest,
				request.typeOfSystem,
				request.quantity,
				request.model || '',
				request.requestedBy,
				`"${request.purposeOfRequest}"`,
				request.usernameDesignation,
				request.emailIdRequest || '',
				request.dateOfJoining || '',
				request.createdAt
			].join(','))
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `it-requests-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>IT Requests Reports - National Group Portal</title>
</svelte:head>

<div class="header-container">
	<div class="logo-container">
		<img src={logoPath} alt="Logo" width="120" />
	</div>

	<nav class="navigation">
		<a href="/home" class="nav-link">Home</a>
		<a href="/request" class="nav-link">IT Request</a>
		<a href="/reports" class="nav-link active">Reports</a>
		<a href="/contact" class="nav-link">Contact</a>
	</nav>
</div>

<div class="reports-container">
	<div class="reports-header">
		<h1>IT Requests Reports</h1>
		<p>View and manage all submitted IT requests</p>
	</div>

	<div class="controls-section">
		<div class="search-controls">
			<div class="search-box">
				<input
					type="text"
					placeholder="Search by code, name, system type, or purpose..."
					bind:value={searchTerm}
				/>
				<svg class="search-icon" viewBox="0 0 24 24">
					<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>

			<select bind:value={sortBy} class="sort-select">
				<option value="date">Sort by Date</option>
				<option value="code">Sort by Code</option>
				<option value="name">Sort by Name</option>
				<option value="type">Sort by Type</option>
			</select>

			<button class="export-btn" on:click={exportToCSV}>
				<svg viewBox="0 0 24 24">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
					<polyline points="14,2 14,8 20,8" />
					<line x1="16" y1="13" x2="8" y2="13" />
					<line x1="16" y1="17" x2="8" y2="17" />
					<polyline points="10,9 9,9 8,9" />
				</svg>
				Export CSV
			</button>
		</div>

		<div class="stats-cards">
			<div class="stat-card">
				<div class="stat-number">{data.requests.length}</div>
				<div class="stat-label">Total Requests</div>
			</div>
			<div class="stat-card">
				<div class="stat-number">
					{data.requests.filter(r => 
						Math.floor((Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24)) < 7
					).length}
				</div>
				<div class="stat-label">This Week</div>
			</div>
			<div class="stat-card">
				<div class="stat-number">
					{data.requests.filter(r => 
						Math.floor((Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24)) < 1
					).length}
				</div>
				<div class="stat-label">Today</div>
			</div>
		</div>
	</div>

	<div class="requests-table">
		{#if sortedRequests.length > 0}
			<div class="table-container">
				<table>
					<thead>
						<tr>
							<th>Status</th>
							<th>Requisition Code</th>
							<th>Date Requested</th>
							<th>Type of System</th>
							<th>Quantity</th>
							<th>Requested By</th>
							<th>Purpose</th>
							<th>Created</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each sortedRequests as request}
							{@const status = getStatusBadge(request)}
							<tr>
								<td>
									<span class="status-badge {status.class}">{status.text}</span>
								</td>
								<td class="code-cell">{request.requisitionCode}</td>
								<td>{request.dateOfRequest}</td>
								<td>{request.typeOfSystem}</td>
								<td>{request.quantity}</td>
								<td>{request.requestedBy}</td>
								<td class="purpose-cell">{request.purposeOfRequest}</td>
								<td>{request.createdAt}</td>
								<td>
									<button class="view-btn" on:click={() => window.alert(JSON.stringify(request, null, 2))}>
										View Details
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="empty-state">
				<svg viewBox="0 0 24 24" class="empty-icon">
					<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<h3>No IT requests found</h3>
				<p>
					{#if searchTerm}
						No requests match your search criteria. Try adjusting your search terms.
					{:else}
						No IT requests have been submitted yet.
					{/if}
				</p>
			</div>
		{/if}
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

	.reports-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 180px 2rem 2rem;
	}

	.reports-header {
		text-align: center;
		margin-bottom: 2rem;
		color: white;
	}

	.reports-header h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.reports-header p {
		font-size: 1.1rem;
		opacity: 0.9;
	}

	.controls-section {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 16px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.search-controls {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.search-box {
		position: relative;
		flex: 1;
		min-width: 300px;
	}

	.search-box input {
		width: 100%;
		padding: 12px 16px 12px 44px;
		border: none;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.9);
		font-size: 1rem;
		transition: all 0.3s ease;
	}

	.search-box input:focus {
		outline: none;
		background: white;
		box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
	}

	.search-icon {
		position: absolute;
		left: 16px;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		height: 20px;
		stroke: #666;
		fill: none;
		stroke-width: 2;
	}

	.sort-select {
		padding: 12px 16px;
		border: none;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.9);
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.sort-select:focus {
		outline: none;
		background: white;
		box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
	}

	.export-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 20px;
		background: linear-gradient(135deg, #ffd700, #ffed4e);
		color: #333;
		border: none;
		border-radius: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.export-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
	}

	.export-btn svg {
		width: 18px;
		height: 18px;
		stroke: currentColor;
		fill: none;
		stroke-width: 2;
	}

	.stats-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}

	.stat-card {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		padding: 1.5rem;
		text-align: center;
		color: white;
	}

	.stat-number {
		font-size: 2rem;
		font-weight: 700;
		color: #ffd700;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.requests-table {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 16px;
		overflow: hidden;
	}

	.table-container {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		background: linear-gradient(135deg, #667eea, #764ba2);
		color: white;
		padding: 1rem;
		text-align: left;
		font-weight: 600;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	td {
		padding: 1rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		vertical-align: top;
	}

	tr:hover {
		background: rgba(255, 215, 0, 0.1);
	}

	.status-badge {
		padding: 4px 12px;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.status-new {
		background: linear-gradient(135deg, #4ade80, #22c55e);
		color: white;
	}

	.status-pending {
		background: linear-gradient(135deg, #f59e0b, #d97706);
		color: white;
	}

	.status-review {
		background: linear-gradient(135deg, #3b82f6, #1d4ed8);
		color: white;
	}

	.code-cell {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-weight: 600;
		color: #667eea;
	}

	.purpose-cell {
		max-width: 300px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.view-btn {
		padding: 6px 12px;
		background: linear-gradient(135deg, #667eea, #764ba2);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.view-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		color: #666;
	}

	.empty-icon {
		width: 64px;
		height: 64px;
		margin: 0 auto 1rem;
		stroke: #ccc;
		fill: none;
		stroke-width: 1.5;
	}

	.empty-state h3 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		color: #333;
	}

	@media (max-width: 768px) {
		.reports-container {
			padding: 1rem;
		}

		.search-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.search-box {
			min-width: auto;
		}

		.stats-cards {
			grid-template-columns: 1fr;
		}

		table {
			font-size: 0.8rem;
		}

		th, td {
			padding: 0.5rem;
		}

		.purpose-cell {
			max-width: 150px;
		}
	}
</style>
