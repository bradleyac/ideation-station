<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Spinner from '$lib/components/Spinner.svelte';
	import { getCatalog } from '$lib/remotes/catalog.remote';
	import { getCategory } from '$lib/remotes/category.remote';
	import { getIdea } from '$lib/remotes/idea.remote';
	import '../app.css';

	let { children } = $props();

	const route = $derived(page.route);
	const catalogs = $derived(page.data.catalogs);
	const getCatalogPromise = $derived(
		page.params.catalogId ? getCatalog(page.params.catalogId) : undefined
	);
	const getCategoryPromise = $derived(
		page.params.categoryId ? getCategory(page.params.categoryId) : undefined
	);
	const getIdeaPromise = $derived(page.params.ideaId ? getIdea(page.params.ideaId) : undefined);
	const catalogName = $derived(page.params.catalogId ? (await getCatalogPromise)?.name : undefined);
	const categoryName = $derived(
		page.params.categoryId ? (await getCategoryPromise)?.name : undefined
	);
	const ideaName = $derived(page.params.ideaId ? (await getIdeaPromise)?.name : undefined);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="h-svh flex flex-col">
	<nav
		data-sveltekit-reload
		class="p-3 h-(--nav-height) content-center sticky top-0 z-1 bg-gray-50 dark:bg-gray-900 shadow-black/30 shadow-xs"
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
						<a href="/catalogs/{page.params.catalogId}">{catalogName}</a>
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
	<div class="h-[calc(100%_-_calc(var(--spacing)_*_var(--nav-height)_*_1.5))]">
		<svelte:boundary>
			{#snippet pending()}
				<Spinner />
			{/snippet}

			{@render children()}
		</svelte:boundary>
	</div>
</div>
