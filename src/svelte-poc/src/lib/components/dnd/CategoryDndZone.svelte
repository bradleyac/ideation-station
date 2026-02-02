<script lang="ts">
	import type { CategoryFull, Idea } from '$lib/types';
	import { dndzone, type DndEvent, TRIGGERS } from 'svelte-dnd-action';
	import IdeaPreview from '../../../routes/catalogs/[catalogId]/ideas/IdeaPreview.svelte';
	import { flip } from 'svelte/animate';

	let { ...props }: { catalogId: string; category: CategoryFull; ideas: Idea[] } = $props();

	let ideas = $derived(
		props.category?.ideaIds?.map((id) => props.ideas.find((idea) => idea.id === id)!) ?? []
	);

	function onConsider(e: CustomEvent<DndEvent<Idea>>) {
		ideas = e.detail.items;
	}
	function onFinalize(e: CustomEvent<DndEvent<Idea>>) {
		ideas = e.detail.items;
		if (e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			ideas = e.detail.items;
			fetch(
				`/catalogs/${props.catalogId}/ideas/${e.detail.info.id}/categories/${props.category.id}`,
				{ method: 'PUT' }
			);
		} else if (e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ANOTHER) {
			ideas = e.detail.items;
		}
	}
</script>

<div
	use:dndzone={{ items: ideas, useCursorForDetection: true }}
	onconsider={onConsider}
	onfinalize={onFinalize}
	class="flex flex-row flex-wrap divide-y outline rounded-sm overflow-y-auto overflow-x-hidden h-full place-items-start place-content-start -outline-offset-1"
>
	{#each ideas as idea (idea.id)}
		<div class="flex flex-col w-full max-w-full overflow-hidden" animate:flip={{ duration: 100 }}>
			<IdeaPreview mode="compact" {idea} catalogId={props.catalogId} />
		</div>
	{/each}
</div>
