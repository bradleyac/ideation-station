<script lang="ts">
	import { getCatalog } from '$lib/remotes/catalog.remote';

	const props: { catalogId: string } = $props();
</script>

{#await getCatalog(props.catalogId)}
	Loading...
{:then catalog}
	{#if catalog}
		<div class="bg-eucalyptus-300 dark:bg-eucalyptus-700 rounded-sm">
			<a class="flex flex-col p-4 h-full w-full" href="/catalogs/{catalog.id}"
				><h2>{catalog.name}</h2>
				<pre>{catalog.desc}</pre></a
			>
		</div>
	{:else}
		Catalog not found.
	{/if}
{/await}
