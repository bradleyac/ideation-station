<script lang="ts">
	import type { Idea } from '$lib/types.js';
	const {
		idea,
		mode = 'default',
		catalogId
	}: {
		idea: Idea;
		mode?: 'default' | 'compact';
		catalogId: string;
	} = $props();
</script>

{#if mode === 'default'}
	<a
		class="inline-block rounded-sm shadow-amber-500/30 shadow-sm px-4 py-3 bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800"
		tabindex="0"
		href="/catalogs/{catalogId}/ideas/{idea.id}"
		data-id={idea.id}
	>
		{idea.name}
	</a>
{:else if mode === 'compact'}
	<a
		class="inline-block p-1 w-full bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800"
		href="/catalogs/{catalogId}/ideas/{idea.id}"
		data-id={idea.id}
	>
		{idea.name}
	</a>
{/if}
