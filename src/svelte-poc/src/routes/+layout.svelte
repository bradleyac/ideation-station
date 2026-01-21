<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import 'tippy.js/dist/tippy.css';

	let { children } = $props();

	const route = $derived(page.route);
	const title = $derived(page.data.title);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div>
	<nav
		data-sveltekit-reload
		class="p-3 h-12 content-center sticky top-0 z-1 bg-gray-50 dark:bg-gray-900 shadow-black/30 shadow-xs"
	>
		<ul class="p-0 m-0 list-none flex gap-4">
			{#each [{ path: '/', name: 'Home', subPages: [] }, { path: '/catalog', name: 'Idea Catalog', subPages: ['/ideas/[ideaId]', '/categories/[categoryId]'] }] as { path, name, subPages }}
				<li class="flex gap-2 last:overflow-hidden">
					{#if route.id === path}
						{name}
					{:else}
						<a class="whitespace-nowrap" href={path}>{name}</a>
						{#each subPages as subPath}
							{#if route.id === `${path}${subPath}`}
								<div class="border-e"></div>
								<span class="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
									{title ?? ''}
								</span>
							{/if}
						{/each}
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
	<div>
		{@render children()}
	</div>
</div>
