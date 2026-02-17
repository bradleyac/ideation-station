<script lang="ts">
	import { getCatalog } from '$lib/remotes/catalog.remote';
	import type { Catalog } from '$lib/types';

	const props: { catalogId: string } = $props();
	let catalog = $state<Catalog>();
</script>

<div class="bg-eucalyptus-300 dark:bg-eucalyptus-700 rounded-sm">
	<svelte:boundary>
		{#snippet failed()}
			<p class="p-4 h-full w-full">Failed to load catalog.</p>
		{/snippet}
		{#if (catalog = await getCatalog(props.catalogId))}
			<a class="flex flex-col p-4 h-full w-full" href="/catalogs/{catalog.id}"
				><h2>{catalog.name}</h2>
				<pre>{catalog.desc}</pre></a
			>
		{:else}
			<p class="p-4 h-full w-full">Catalog not found.</p>
		{/if}
	</svelte:boundary>
</div>
