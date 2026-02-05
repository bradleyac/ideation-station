<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();

	const route = $derived(page.route);
	const catalogName = $derived(page.data.catalog?.name);
	const categoryName = $derived(page.data.category?.name);
	const ideaName = $derived(page.data.idea?.name);
	const catalogId = $derived(page.data.catalog?.id);
	const catalogs = $derived(page.data.catalogs);
	// TODO: List out the catalogs in a menu
	interface Page {
		path: string;
		name: string;
		subpages: Page[] | string[];
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div>
	<nav
		data-sveltekit-reload
		class="p-3 h-12 content-center sticky top-0 z-1 bg-gray-50 dark:bg-gray-900 shadow-black/30 shadow-xs"
	>
		<ul class="p-0 m-0 list-none flex gap-4 relative">
			<li class="block border-black">
				{#if route.id === '/'}
					<span class="border-b-2 border-eucalyptus-500">Home</span>
				{:else}
					<a href="/">Home</a>
				{/if}
			</li>
			<li class="flex gap-2 last:overflow-hidden block border-black">
				<div class="group">
					<a href="/catalogs">Idea Catalogs</a>
					{#if catalogs}
						<ul
							class="hidden absolute rounded-sm group-hover:flex z-1 flex-col gap-1 p-2 bg-gray-100 dark:bg-gray-800"
						>
							{#each catalogs as catalog (catalog.id)}
								<li class="w-full flex">
									<a
										class="p-2 rounded-sm w-full hover:bg-gray-200 dark:hover:bg-gray-700"
										href="/catalogs/{catalog.id}">{catalog.name}</a
									>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
				{#if route.id?.startsWith('/catalogs/')}
					/
					{#if route.id === '/catalogs/[catalogId]'}
						<span class="border-b-2 border-eucalyptus-500">{catalogName}</span>
					{:else}
						<a href="/catalogs/{catalogId}">{catalogName}</a>
						/
						{#if route.id === '/catalogs/[catalogId]/categories/[categoryId]'}
							<span class="border-b-2 border-eucalyptus-500">Category: {categoryName}</span>
						{:else if route.id === '/catalogs/[catalogId]/ideas/[ideaId]'}
							<span class="border-b-2 border-eucalyptus-500">Idea: {ideaName}</span>
						{/if}
					{/if}
				{/if}
			</li>
		</ul>
	</nav>
	<div>
		{@render children()}
	</div>
</div>
