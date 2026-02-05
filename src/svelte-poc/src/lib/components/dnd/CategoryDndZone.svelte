<script lang="ts">
	import { getCategory } from '$lib/remotes/category.remote';
	import { getCategoryIdeaIds } from '$lib/remotes/idea.remote';
	import { TRIGGERS, dragHandle, dragHandleZone, type DndEvent } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import IdeaPreview from '../../../routes/catalogs/[catalogId]/ideas/IdeaPreview.svelte';

	let props: { catalogId: string; categoryId: string; connections: boolean } = $props();

	let affix = $state('');
	let prefix = $state(true);

	let draggableItems = $derived(
		(await getCategoryIdeaIds(props.categoryId)).map((ideaId) => {
			return { ideaId };
		})
	);

	function onConsider(e: CustomEvent<DndEvent<{ ideaId: string }>>) {
		draggableItems = e.detail.items;
	}
	function onFinalize(e: CustomEvent<DndEvent<{ ideaId: string }>>) {
		draggableItems = e.detail.items;
		if (e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			fetch(
				`/catalogs/${props.catalogId}/ideas/${e.detail.info.id}/categories/${props.categoryId}`,
				{ method: 'PUT' }
			);
		}
	}
</script>

{#await getCategory(props.categoryId)}
	Loading...
{:then category}
	{#if category}
		<div
			class="grid grid-cols-1 grid-rows-[auto_1fr] gap-3 bg-eucalyptus-200 dark:bg-eucalyptus-800 rounded-sm p-3"
		>
			<a class="block" href="/catalogs/{props.catalogId}/categories/{props.categoryId}"
				><h2>{category.name}</h2></a
			>

			<div
				class="grid grid-cols-1 grid-rows-[auto_1fr] gap-2 h-full overflow-scroll -outline-offset-1"
			>
				<div class="flex gap-2 p-1">
					{#if props.connections}
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
					{:else}
						<div></div>
					{/if}
				</div>
				<div class="h-full overflow-scroll">
					{#await draggableItems}
						Loading...
					{:then relatedIdeaIds}
						<ul
							use:dragHandleZone={{ items: relatedIdeaIds, useCursorForDetection: true }}
							onconsider={onConsider}
							onfinalize={onFinalize}
							class="grid grid-cols-1 auto-rows-max p-1 gap-1 h-full rounded-sm overflow-y-scroll overflow-x-hidden place-items-start place-content-start -outline-offset-1"
						>
							{#each relatedIdeaIds as { ideaId } (ideaId)}
								<li
									class="flex relative -outline-offset-1 w-full overflow-hidden"
									animate:flip={{ duration: 50 }}
								>
									<div class="flex w-full outline rounded-sm overflow-hidden -outline-offset-1">
										<div
											use:dragHandle
											class="p-1 w-4 flex place-items-center place-content-center w-max bg-eucalyptus-500"
										>
											<i class="text-2xl leading-2 fi fi-ts-grip-dots-vertical"></i>
										</div>
										<IdeaPreview
											prefix={props.connections ? prefix : undefined}
											affix={props.connections ? affix : undefined}
											{ideaId}
											catalogId={props.catalogId}
										/>
									</div>
								</li>
							{/each}
						</ul>
					{:catch}
						Oops!
					{/await}
				</div>
			</div>
		</div>
	{:else}
		Category not found.
	{/if}
{/await}
