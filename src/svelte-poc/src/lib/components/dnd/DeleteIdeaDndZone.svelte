<script lang="ts">
	import type { CategoryFull, Idea } from '$lib/types';
	import { dndzone, type DndEvent, TRIGGERS } from 'svelte-dnd-action';
	import IdeaPreview from '../../../routes/catalogs/[catalogId]/ideas/IdeaPreview.svelte';
	import { flip } from 'svelte/animate';
	import { deleteIdea, getIdeas } from '$lib/remotes/idea.remote';
	import { fade } from 'svelte/transition';

	let props: { catalogId: string } = $props();

	let ideas: Idea[] = $state([]);

	function onConsider(e: CustomEvent<DndEvent<Idea>>) {
		ideas = e.detail.items;
	}
	function onFinalize(e: CustomEvent<DndEvent<Idea>>) {
		if (e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			ideas = e.detail.items;
			deleteIdea(ideas[0].id).updates(getIdeas(props.catalogId));
			ideas = [];
		}
	}
</script>

<div class="flex flex-col h-full gap-2 -outline-offset-1">
	<div
		use:dndzone={{ items: ideas, useCursorForDetection: true }}
		onconsider={onConsider}
		onfinalize={onFinalize}
		class="flex flex-row flex-wrap divide-y outline rounded-sm overflow-y-auto overflow-x-hidden h-full place-items-start place-content-start -outline-offset-1"
	>
		{#each ideas as idea (idea.id)}
			<div
				class="flex flex-col w-full max-w-full overflow-hidden"
				animate:flip={{ duration: 100 }}
				out:fade={{ duration: 1000 }}
			>
				<IdeaPreview mode="compact" {idea} catalogId={props.catalogId} />
			</div>
		{/each}
	</div>
</div>
