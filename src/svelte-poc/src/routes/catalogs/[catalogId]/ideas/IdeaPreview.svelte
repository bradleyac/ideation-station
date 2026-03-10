<script lang="ts">
	import Spinner from '$lib/components/Spinner.svelte';
	import { getIdea } from '$lib/remotes/idea.remote';

	const props: {
		ideaId: string;
		mode?: 'default' | 'compact';
		catalogId: string;
	} = $props();
	let mode = $derived(props.mode ?? 'default');

	const sharedClasses =
		'h-max text-ellipsis whitespace-nowrap overflow-hidden w-full shadow-sm bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800';
</script>

<svelte:boundary>
	{#await getIdea(props.ideaId)}
		<div class={[sharedClasses, 'px-4 py-3 min-h-[calc(1em_+_calc(var(--spacing)_*_8))] grid']}>
			<Spinner class="w-min" />
		</div>
	{:then idea}
		{#if idea}
			{#if mode === 'default'}
				<a
					class={[sharedClasses, 'px-4 py-3']}
					tabindex="0"
					href="/catalogs/{props.catalogId}/ideas/{idea.id}"
					data-id={idea.id}
				>
					{idea.name}
				</a>
			{:else if mode === 'compact'}
				<a
					class={[sharedClasses, 'p-2 px-3']}
					href="/catalogs/{props.catalogId}/ideas/{idea.id}"
					data-id={idea.id}
				>
					{idea.name}
				</a>
			{/if}
		{/if}
	{/await}
</svelte:boundary>
