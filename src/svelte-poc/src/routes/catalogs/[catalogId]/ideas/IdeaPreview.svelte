<script lang="ts">
	import { getIdea } from '$lib/remotes/idea.remote';

	const props: {
		ideaId: string;
		mode?: 'default' | 'compact';
		catalogId: string;
		prefix?: boolean;
		affix?: string;
	} = $props();
	let mode = $derived(props.mode ?? 'default');
	let idea = $derived(await getIdea(props.ideaId));

	const sharedClasses =
		'h-max inline-block text-ellipsis whitespace-nowrap overflow-hidden w-full shadow-sm bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800';
</script>

<svelte:boundary>
	{#if idea}
		{#if mode === 'default'}
			<a
				class={[sharedClasses, 'px-4 py-3']}
				tabindex="0"
				href="/catalogs/{props.catalogId}/ideas/{idea.id}"
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
				class={[sharedClasses, 'p-2 px-3']}
				href="/catalogs/{props.catalogId}/ideas/{idea.id}"
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
	{:else}
		<p class={[sharedClasses, 'px-4 py-3']}>Idea not found.</p>
	{/if}
</svelte:boundary>
