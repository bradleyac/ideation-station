<script lang="ts">
	import type { CategoryFull, Idea } from '$lib/types';
	import { dndzone, type DndEvent, TRIGGERS, dragHandleZone, dragHandle } from 'svelte-dnd-action';
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
			// TODO: Confirm and put it back if declined?
			ideas = e.detail.items;
			deleteIdea(ideas[0].id).updates(getIdeas(props.catalogId));
			ideas = [];
		}
	}
</script>

<div class="flex flex-col h-full gap-2 -outline-offset-1">
	<ul
		use:dragHandleZone={{
			items: ideas,
			useCursorForDetection: true,
			dropTargetClasses: [
				'ring',
				'ring-red-500',
				'bg-red-100',
				'dark:bg-red-900',
				'before:block',
				'before:fi',
				'before:fi-rr-trash',
				'before:w-full',
				'before:h-10',
				'before:block',
				'before:absolute',
				'before:p-4',
				'before:content-["Drag_Ideas_here_to_delete_them."]'
			]
		}}
		onconsider={onConsider}
		onfinalize={onFinalize}
		class="flex flex-row flex-wrap divide-y outline rounded-sm overflow-y-auto overflow-x-hidden h-full place-items-start place-content-start -outline-offset-1"
	>
		{#each ideas as idea (idea.id)}
			<li
				class="flex relative -outline-offset-1 w-full overflow-hidden"
				animate:flip={{ duration: 50 }}
			>
				<div class="flex w-full outline rounded-sm overflow-hidden -outline-offset-1">
					<div
						use:dragHandle
						class="p-1 w-4 flex place-items-center place-content-center w-max bg-eucalyptus-500"
						aria-label="drag-handle for {idea.name}"
					>
						<i class="text-2xl leading-2 fi fi-ts-grip-dots-vertical"></i>
					</div>
					<IdeaPreview {idea} catalogId={props.catalogId} />
				</div>
			</li>
		{/each}
	</ul>
</div>
