<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Spinner from '$lib/components/Spinner.svelte';
	import { getAllCatalogMetadata, getCatalog } from '$lib/remotes/catalog.remote';
	import { getAllCategoryMetadata, getCategory } from '$lib/remotes/category.remote';
	import { getIdea } from '$lib/remotes/idea.remote';
	import '../app.css';

	let { children } = $props();

	let routeId = $derived(page.route.id);
	let url = $derived(page.url);

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
	let catalogs = $state<{ id: string; name: string }[] | undefined>(undefined);
	$effect(() => {
		getAllCatalogMetadata()
			.then((metadata) => {
				catalogs = metadata;
			})
			.catch(console.error);
	});

	let categories = $state<{ id: string; name: string }[] | undefined>(undefined);
	$effect(() => {
		if (page.params.catalogId) {
			getAllCategoryMetadata(page.params.catalogId)
				.then((metadata) => (categories = metadata))
				.catch(console.error);
		}
	});

	let navigating = $state(false);

	beforeNavigate(() => {
		navigating = true;
	});

	afterNavigate(() => {
		navigating = false;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="h-svh flex flex-col">
	<nav
		class="p-3 h-(--nav-height) content-center sticky top-0 z-1 bg-gray-50 dark:bg-gray-900 shadow-black/30 shadow-xs"
	>
		<ul class="p-0 m-0 list-none flex gap-4 relative">
			{#key url.pathname}
				<li class="block border-black">
					{#if routeId === '/'}
						<span class="border-b-2 border-eucalyptus-500">Home</span>
					{:else}
						<a href="/">Home</a>
					{/if}
				</li>
				<li class="flex gap-2 block border-black">
					<div class="group">
						<a
							class={[routeId === '/catalogs' && 'border-b-2 border-eucalyptus-500']}
							href="/catalogs">Idea Catalogs</a
						>
						{#if catalogs}
							<ul
								class="hidden absolute rounded-sm group-hover:flex z-1 flex-col gap-1 p-2 bg-gray-100 dark:bg-gray-800"
							>
								{#each catalogs as catalog (catalog.id)}
									<li class="w-full flex">
										<a
											inert={navigating}
											class="p-2 rounded-sm w-full hover:bg-gray-200 dark:hover:bg-gray-700"
											href="/catalogs/{catalog.id}">{catalog.name}</a
										>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
					{#if routeId?.startsWith('/catalogs/')}
						/
						<div class="group">
							<a
								class={[routeId === '/catalogs/[catalogId]' && 'border-b-2 border-eucalyptus-500']}
								href="/catalogs/{page.params.catalogId}">{catalogName}</a
							>
							{#if categories}
								<ul
									class="hidden absolute rounded-sm group-hover:flex w-max z-1 flex-col gap-1 p-2 bg-gray-100 dark:bg-gray-800"
								>
									{#each categories as category (category.id)}
										<li class="w-full flex">
											<a
												inert={navigating}
												class="p-2 rounded-sm w-full hover:bg-gray-200 dark:hover:bg-gray-700"
												href="/catalogs/{page.params.catalogId}/categories/{category.id}"
												>{category.name}</a
											>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
						{#if routeId?.startsWith('/catalogs/[catalogId]/')}
							/
							{#if routeId === '/catalogs/[catalogId]/categories/[categoryId]'}
								<span class="border-b-2 border-eucalyptus-500">Category: {categoryName}</span>
							{:else if routeId === '/catalogs/[catalogId]/ideas/[ideaId]'}
								<span class="border-b-2 border-eucalyptus-500">Idea: {ideaName}</span>
							{/if}
						{/if}
					{/if}
				</li>
			{/key}
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
