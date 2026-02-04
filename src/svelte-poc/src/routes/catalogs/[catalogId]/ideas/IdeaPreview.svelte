<script lang="ts">
	import type { Idea } from '$lib/types.js';
	const {
		idea,
		catalogId,
		...props
	}: {
		idea: Idea;
		mode?: 'default' | 'compact';
		catalogId: string;
		prefix?: boolean;
		affix?: string;
	} = $props();
	let mode = $derived(props.mode ?? 'default');
</script>

{#if mode === 'default'}
	<a
		class="h-max inline-block text-ellipsis whitespace-nowrap overflow-hidden w-full shadow-amber-500/30 shadow-sm px-4 py-3 bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800"
		tabindex="0"
		href="/catalogs/{catalogId}/ideas/{idea.id}"
		data-id={idea.id}
	>
		{#if props.prefix && props.affix}
			{props.affix}
		{/if}
		{idea.name}
		{#if !props.prefix && props.affix}
			{props.affix}
		{/if}
	</a>
{:else if mode === 'compact'}
	<a
		class="h-max inline-block p-2 px-3 text-ellipsis whitespace-nowrap overflow-hidden w-full bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800"
		href="/catalogs/{catalogId}/ideas/{idea.id}"
		data-id={idea.id}
	>
		{#if props.prefix && props.affix}
			{props.affix}
		{/if}
		{idea.name}
		{#if !props.prefix && props.affix}
			{props.affix}
		{/if}
	</a>
{/if}
