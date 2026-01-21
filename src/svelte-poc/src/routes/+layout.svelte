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
	<nav data-sveltekit-reload class="p-4 bg-eucalyptus-500 overflow-hidden h-16 content-center">
		<ul class="p-0 m-0 flex gap-4 overflow-hidden text-eucalyptus-800 dark:text-eucalyptus-200">
			{#each [{ path: '/', name: 'Home', subPages: [] }, { path: '/catalog', name: 'Idea Catalog', subPages: ['/ideas/[ideaId]', '/categories/[categoryId]'] }] as { path, name, subPages }}
				<li class="flex gap-2 list-none">
					{#if route.id === path}
						{name}
					{:else}
						<a class="text-eucalyptus-900 dark:text-eucalyptus-100" href={path}>{name}</a>
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
	<div class="my-4 lg:mx-4">
		{@render children()}
	</div>
</div>
