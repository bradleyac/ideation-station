<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { getCategory } from '$lib/remotes/category.remote.js';
	import { getCategoryIdeaIds } from '$lib/remotes/idea.remote';
	import type { CategoryFull } from '$lib/types.js';
	import type { ActionResult } from '@sveltejs/kit';
	import { tick } from 'svelte';
	import IdeaForm from '../../ideas/IdeaForm.svelte';
	import IdeaList from '../../ideas/IdeaList.svelte';
	import CategoryForm from '../CategoryForm.svelte';

	const { params } = $props();

	let category = $derived(await getCategory(params.categoryId));

	async function deleteCategory(category?: CategoryFull) {
		if (!category) return;
		if (confirm(`Really delete "${category.name}"?`)) {
			await fetch(`/catalogs/${params.catalogId}/categories/${category.id}`, {
				method: 'DELETE'
			});
			await goto(`/catalogs/${params.catalogId}`);
			await invalidateAll();
		}
	}

	async function deleteCategoryIdeas(category?: CategoryFull) {
		if (!category) return;
		const ideaIds = category.ideaIds;
		if (confirm(`Really delete all ideas in "${category.name}"?`)) {
			await tick();
			await fetch(`/catalogs/${params.catalogId}/categories/${category.id}/ideas`, {
				method: 'DELETE'
			}).catch(() => (category.ideaIds = ideaIds));
			await invalidateAll();
		}
	}

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

	let showModal = $state(false);
	let whichModal = $state<'idea' | 'edit'>('edit');
	let modalKey = $state(0);
</script>

<svelte:head><title>{category?.name}</title></svelte:head>

<Modal bind:showModal>
	{#key modalKey}
		{#if whichModal === 'idea'}
			<IdeaForm
				catalogId={params.catalogId}
				defaultCategoryId={params.categoryId === 'Uncategorized' ? undefined : params.categoryId}
				{enhanceCallback}
			/>
		{:else}
			<CategoryForm
				catalogId={params.catalogId}
				existingCategorId={params.categoryId}
				{enhanceCallback}
			/>
		{/if}
	{/key}
</Modal>

{#key params.categoryId}
	{#await category}
		Loading...
	{:then category}
		{#if category}
			<!-- <div class="fixed z-2 top-2.5 right-4 invisible lg:visible">
			<TextTicker labels={relatedIdeas.map((idea) => idea.name)} period={5000} />
		</div> -->

			<section class="flex flex-col gap-4 m-3">
				<h1>{category.name}</h1>
				<pre>{category.desc}</pre>
				<div class="flex flex-wrap gap-2">
					<Button
						type="button"
						title="Edit Category"
						onclick={() => {
							showModal = true;
							whichModal = 'edit';
							modalKey++;
						}}><i class="fi fi-rr-edit"></i>Edit Category</Button
					>

					<Button
						class="flex place-items-center w-max p-2"
						onclick={() => {
							showModal = true;
							whichModal = 'idea';
							modalKey++;
						}}
						title="Create Idea"><i class="block fi fi-rr-add"></i>New Idea</Button
					>

					<Button
						class="flex place-items-center w-max p-2"
						onclick={() => deleteCategoryIdeas(category)}
						title="Delete All Ideas"><i class="fi fi-rr-trash"></i>Delete All Ideas</Button
					>

					{#if params.categoryId !== 'Uncategorized'}
						<Button
							class="flex place-items-center w-max p-2"
							onclick={() => deleteCategory(category)}
							title="Delete Category"><i class="fi fi-rr-trash"></i>Delete Category</Button
						>
					{/if}
				</div>

				{#await getCategoryIdeaIds(params.categoryId)}
					Loading...
				{:then relatedIdeaIds}
					<IdeaList
						catalogId={params.catalogId}
						title="Contained Ideas"
						ideaIds={relatedIdeaIds}
						categoryId={params.categoryId}
					/>
				{/await}
			</section>
		{:else}
			Category not found.
		{/if}
	{/await}
{/key}
