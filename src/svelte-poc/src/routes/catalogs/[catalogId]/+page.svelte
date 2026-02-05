<script lang="ts">
	import Collapse from '$lib/components/Collapse.svelte';
	import IdeaPreview from './ideas/IdeaPreview.svelte';
	import TextTicker from '$lib/components/TextTicker.svelte';
	import IdeaForm from './ideas/IdeaForm.svelte';
	import CategoryPreview from './categories/CategoryPreview.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';
	import CategoryForm from './categories/CategoryForm.svelte';
	import { type Idea as IdeaT } from '$lib/types.js';
	import { invalidateAll } from '$app/navigation';
	import Idea from './ideas/Idea.svelte';
	import IdeaMenu from './ideas/IdeaMenu.svelte';
	import IdeaList from './ideas/IdeaList.svelte';
	import CategoryList from './categories/CategoryList.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import CatalogForm from '../CatalogForm.svelte';
	import { fromEventPattern } from 'rxjs';
	import CategoryDndZone from '$lib/components/dnd/CategoryDndZone.svelte';
	import { getIdeas } from '$lib/remotes/idea.remote.js';
	import DeleteIdeaDndZone from '$lib/components/dnd/DeleteIdeaDndZone.svelte';

	const { data, params, ...props } = $props();
	const aspirationsCategoryId = $derived(
		data.categories.find((cat) => cat.name === 'Aspirations')?.id ?? ''
	);

	let showModal = $state(false);
	let modalKey = $state(0);
	let whichModal = $state<'edit' | 'category' | 'idea'>('edit');
	let catalog = $derived(data.catalogs.find((c) => c.id === params.catalogId));
	let sortedCategories = $derived(data.categories.toSorted((a, b) => (a.name > b.name ? 1 : -1)));
	let connections = $derived(!!catalog?.settings?.connections);

	$inspect(connections);

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
			<IdeaForm catalogId={params.catalogId} extantCategories={data.categories} {enhanceCallback} />
		{:else if whichModal === 'category'}
			<CategoryForm catalogId={params.catalogId} {enhanceCallback} />
		{:else if whichModal === 'edit'}
			<CatalogForm existingCatalog={catalog} {enhanceCallback} />
		{/if}
	{/key}
</Modal>

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

		{#if aspirationsCategoryId}
			<div class="top-2.5 right-4 invisible lg:visible z-2 fixed">
				<!-- <TextTicker
					period={5000}
					labels={allIdeas
						.filter((idea) => idea.categoryId === aspirationsCategoryId)
						.map((idea) => idea.name)}
				/> -->
			</div>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[20rem] gap-4">
			{#each sortedCategories as category (category.id)}
				<div
					class="grid grid-cols-1 grid-rows-[auto_1fr] gap-3 bg-eucalyptus-200 dark:bg-eucalyptus-800 rounded-sm p-3"
				>
					<a class="block" href="/catalogs/{params.catalogId}/categories/{category.id}"
						><h2>{category.name}</h2></a
					>
					<CategoryDndZone {connections} {category} catalogId={params.catalogId} />
				</div>
			{/each}
			<DeleteIdeaDndZone catalogId={params.catalogId} />
		</div>
	</section>
{/if}
