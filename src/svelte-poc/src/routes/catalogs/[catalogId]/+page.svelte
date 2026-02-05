<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import CategoryDndZone from '$lib/components/dnd/CategoryDndZone.svelte';
	import DeleteIdeaDndZone from '$lib/components/dnd/DeleteIdeaDndZone.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { getCatalog } from '$lib/remotes/catalog.remote';
	import { getCategoryIds } from '$lib/remotes/category.remote';
	import type { ActionResult } from '@sveltejs/kit';
	import CatalogForm from '../CatalogForm.svelte';
	import CategoryForm from './categories/CategoryForm.svelte';
	import IdeaForm from './ideas/IdeaForm.svelte';

	const { data, params, ...props } = $props();
	// const aspirationsCategoryId = $derived(
	// 	data.categories.find((cat) => cat.name === 'Aspirations')?.id ?? ''
	// );

	let showModal = $state(false);
	let modalKey = $state(0);
	let whichModal = $state<'edit' | 'category' | 'idea'>('edit');
	// let sortedCategories = $derived(data.categories.toSorted((a, b) => (a.name > b.name ? 1 : -1)));
	let catalog = $derived(await getCatalog(params.catalogId));
	let connections = $derived(catalog?.settings?.connections ?? false);

	function enhanceCallback(): ({
		update,
		result
	}: {
		update: () => Promise<void>;
		result: ActionResult;
	}) => Promise<void> {
		return async ({ update, result }) => {
			if (result?.type === 'success') {
				showModal = false;
				await invalidateAll();
			}
			await update();
		};
	}
</script>

<svelte:head><title>Idea Catalog</title></svelte:head>

<Modal bind:showModal>
	{#key modalKey}
		{#if whichModal === 'idea'}
			<IdeaForm catalogId={params.catalogId} {enhanceCallback} />
		{:else if whichModal === 'category'}
			<CategoryForm catalogId={params.catalogId} {enhanceCallback} />
		{:else if whichModal === 'edit'}
			<CatalogForm existingCatalogId={params.catalogId} {enhanceCallback} />
		{/if}
	{/key}
</Modal>

{#await catalog}
	Loading...
{:then catalog}
	{#if catalog}
		<section class="flex flex-col gap-4 m-3">
			<h1>{catalog.name}</h1>
			<pre>{catalog.desc}</pre>

			<div class="flex flex-wrap gap-2">
				<Button
					onclick={() => {
						showModal = true;
						modalKey++;
						whichModal = 'edit';
					}}
					title="Edit Catalog"><i class="block fi fi-rr-edit"></i>Edit Catalog</Button
				>

				<Button
					onclick={() => {
						showModal = true;
						modalKey++;
						whichModal = 'idea';
					}}
					title="Create Idea"><i class="block fi fi-rr-add"></i>New Idea</Button
				>

				<Button
					onclick={() => {
						showModal = true;
						modalKey++;
						whichModal = 'category';
					}}
					title="Create Category"><i class="block fi fi-rr-add"></i>New Category</Button
				>
				{#if connections}
					<form action="/catalogs/{params.catalogId}?/loadConnections" method="POST" use:enhance>
						<input type="text" name="dummy" value="dummy" class="hidden" />
						<Button type="submit"><i class="block fi fi-rr-add"></i>From Connections</Button>
					</form>
				{/if}
			</div>

			<!-- {#if aspirationsCategoryId}
			<div class="top-2.5 right-4 invisible lg:visible z-2 fixed">
				<TextTicker
					period={5000}
					labels={allIdeas
						.filter((idea) => idea.categoryId === aspirationsCategoryId)
						.map((idea) => idea.name)}
				/>
			</div>
		{/if} -->

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[20rem] gap-4">
				{#await getCategoryIds(params.catalogId)}
					Loading...
				{:then categoryIds}
					{#each categoryIds as categoryId (categoryId)}
						<CategoryDndZone {connections} {categoryId} catalogId={params.catalogId} />
					{/each}
				{/await}
				<DeleteIdeaDndZone catalogId={params.catalogId} />
			</div>
		</section>
	{:else}
		Catalog not found.
	{/if}
{/await}
