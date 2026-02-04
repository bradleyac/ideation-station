<script lang="ts">
	import type { CategoryFull, Idea } from '$lib/types';
	import { dndzone, type DndEvent, TRIGGERS, dragHandleZone, dragHandle } from 'svelte-dnd-action';
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

<div class="grid grid-cols-1 grid-rows-[auto_1fr] gap-2 h-full overflow-scroll -outline-offset-1">
	<div class="flex gap-2 p-1">
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
	<div class="h-full overflow-scroll">
		{#await relatedIdeas}
			Loading...
		{:then ideas}
			<ul
				use:dragHandleZone={{ items: ideas, useCursorForDetection: true }}
				onconsider={onConsider}
				onfinalize={onFinalize}
				class="grid grid-cols-1 auto-rows-max p-1 gap-1 h-full rounded-sm overflow-y-scroll overflow-x-hidden place-items-start place-content-start -outline-offset-1"
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
							<IdeaPreview {prefix} {affix} {idea} catalogId={props.catalogId} />
						</div>
					</li>
				{/each}
			</ul>
		{:catch}
			Oops!
		{/await}
	</div>
</div>
