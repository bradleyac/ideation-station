<!-- <script lang="ts">
	import Tooltip from '$lib/components/Tooltip.svelte';
	import CatalogPreview from './CatalogPreview.svelte';

	let { data, ...props } = $props();
	let container: HTMLElement | undefined = $state();
</script>

<ul
	bind:this={container}
	class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-max sm:auto-rows-fr gap-4"
>
	<Tooltip parent={container}>
		{#snippet children(id: string)}
			<CatalogMenu category={categories.filter((cat) => cat.id === id)[0]} />
		{/snippet}
	</Tooltip>
	{#each data.catalogs as catalog (catalog.id)}
		<li><CatalogPreview {catalog} /></li>
	{/each}
</ul> -->
