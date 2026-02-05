<script lang="ts">
	import { deleteIdea, getIdea } from '$lib/remotes/idea.remote';
	import { TRIGGERS, dragHandle, dragHandleZone, type DndEvent } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import IdeaPreview from '../../../routes/catalogs/[catalogId]/ideas/IdeaPreview.svelte';

	let props: { catalogId: string } = $props();

	let ideaIds: { ideaId: string }[] = $state([]);

	function onConsider(e: CustomEvent<DndEvent<{ ideaId: string }>>) {
		ideaIds = e.detail.items;
	}
	function onFinalize(e: CustomEvent<DndEvent<{ ideaId: string }>>) {
		if (e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			// TODO: Confirm and put it back if declined?
			ideaIds = e.detail.items;
			deleteIdea(ideaIds[0].ideaId).updates(
				getIdea(ideaIds[0].ideaId).withOverride((current) => undefined)
			);
			ideaIds = [];
		}
	}
</script>

<div class="flex flex-col h-full gap-2 -outline-offset-1">
	<ul
		use:dragHandleZone={{
			items: ideaIds,
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
		{#each ideaIds as { ideaId } (ideaId)}
			<li
				class="flex relative -outline-offset-1 w-full overflow-hidden"
				out:fade={{ duration: 300 }}
				animate:flip={{ duration: 50 }}
			>
				<div class="flex w-full outline rounded-sm overflow-hidden -outline-offset-1">
					<div
						use:dragHandle
						class="p-1 w-4 flex place-items-center place-content-center w-max bg-eucalyptus-500"
					>
						<i class="text-2xl leading-2 fi fi-ts-grip-dots-vertical"></i>
					</div>
					<IdeaPreview {ideaId} catalogId={props.catalogId} />
				</div>
			</li>
		{/each}
	</ul>
</div>
