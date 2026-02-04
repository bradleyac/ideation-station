<script lang="ts">
	import type { CategoryFull, Idea } from '$lib/types';
	import { dndzone, type DndEvent, TRIGGERS } from 'svelte-dnd-action';
	import IdeaPreview from '../../../routes/catalogs/[catalogId]/ideas/IdeaPreview.svelte';
	import { flip } from 'svelte/animate';
	import { getIdeas } from '$lib/remotes/idea.remote';

	let { ...props }: { catalogId: string; category: CategoryFull } = $props();

	let relatedIdeas = $derived(
		(await getIdeas(props.catalogId)).filter((idea) => props.category.ideaIds.includes(idea.id)) ??
			[]
	);

	let affix = $state('');
	let prefix = $state(true);

	function onConsider(e: CustomEvent<DndEvent<Idea>>) {
		relatedIdeas = e.detail.items;
	}
	function onFinalize(e: CustomEvent<DndEvent<Idea>>) {
		relatedIdeas = e.detail.items;
		if (e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			fetch(
				`/catalogs/${props.catalogId}/ideas/${e.detail.info.id}/categories/${props.category.id}`,
				{ method: 'PUT' }
			);
		}
	}
</script>

<div class="flex flex-col h-full gap-2 -outline-offset-1">
	<div class="flex gap-2">
		<input
			type="checkbox"
			class="max-w-1 place-self-center ms-1"
			defaultChecked={true}
			title={prefix ? 'Prefix' : 'Suffix'}
			oninput={(e) => (prefix = (e.target as HTMLInputElement)?.checked)}
		/>
		<input
			class="w-full"
			type="text"
			placeholder={prefix ? 'Prefix' : 'Suffix'}
			oninput={(e) => (affix = (e.target as HTMLInputElement)?.value?.toUpperCase())}
		/>
	</div>
	{#await relatedIdeas}
		Loading...
	{:then ideas}
		<div
			use:dndzone={{ items: ideas, useCursorForDetection: true, delayTouchStart: true }}
			onconsider={onConsider}
			onfinalize={onFinalize}
			class="flex flex-row flex-wrap divide-y outline rounded-sm overflow-y-auto overflow-x-hidden h-full place-items-start place-content-start -outline-offset-1"
		>
			{#each ideas as idea (idea.id)}
				<div
					class="flex flex-col w-full max-w-full overflow-hidden"
					animate:flip={{ duration: 100 }}
				>
					<IdeaPreview {prefix} {affix} mode="compact" {idea} catalogId={props.catalogId} />
				</div>
			{/each}
		</div>
	{:catch}
		Oops!
	{/await}
</div>
