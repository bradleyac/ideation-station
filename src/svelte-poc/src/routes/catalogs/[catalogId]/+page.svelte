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

	const { data, params, ...props } = $props();
	const aspirationsCategoryId = $derived(
		data.categories.find((cat) => cat.name === 'Aspirations')?.id ?? ''
	);

	let showModal = $state(false);
	let modalKey = $state(0);
	let whichModal = $state<'edit' | 'category' | 'idea'>('edit');
	let catalog = $derived(data.catalogs.find((c) => c.id === params.catalogId));

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

		<div class="flex gap-2">
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
		</div>

		{#if props.categoryId}
			<div class="top-2.5 right-4 invisible lg:visible z-2 fixed">
				<TextTicker
					period={5000}
					labels={data.ideas
						.filter((idea) => idea.categoryIds?.includes(aspirationsCategoryId))
						.map((idea) => idea.name)}
				/>
			</div>
		{/if}

		<CategoryList
			catalogId={params.catalogId}
			title="All Categories"
			categories={data.categories}
		/>

		<IdeaList catalogId={params.catalogId} title="All Ideas" ideas={data.ideas} />
	</section>
{/if}
