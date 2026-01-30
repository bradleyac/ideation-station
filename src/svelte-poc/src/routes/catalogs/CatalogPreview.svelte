<script lang="ts">
	import type { Catalog } from '$lib/types';

	const props: { catalog: Catalog } = $props();
</script>

<div class="bg-eucalyptus-300 dark:bg-eucalyptus-700 rounded-sm">
	<a class="flex flex-col p-4 h-full w-full" href="/catalogs/{props.catalog.id}"
		><h2>{props.catalog.name}</h2>
		<pre>{props.catalog.desc}</pre></a
	>
</div>
