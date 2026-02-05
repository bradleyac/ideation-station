<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import TextTicker from '$lib/components/TextTicker.svelte';
	import { getIdeas } from '$lib/remotes/idea.remote.js';
	import type { CategoryFull, Idea } from '$lib/types.js';
	import type { ActionResult } from '@sveltejs/kit';
	import { tick } from 'svelte';
	import IdeaForm from '../../ideas/IdeaForm.svelte';
	import IdeaList from '../../ideas/IdeaList.svelte';
	import CategoryForm from '../CategoryForm.svelte';

	const { data, params } = $props();

	const allIdeas = $derived(await getIdeas(params.catalogId));

	let relatedIdeas: Idea[] = $derived(
		allIdeas?.filter((idea) => data.ideaIds.includes(idea.id)) ?? []
	);
	// let relatedIdeas: Idea[] = $derived(
	// 	allIdeas.filter((idea) => data.ideaIds.includes(idea.id))
	// );

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
			relatedIdeas = [];
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

<svelte:head><title>{await data.title}</title></svelte:head>

<Modal bind:showModal>
	{#key modalKey}
		{#if whichModal === 'idea'}
			<IdeaForm
				catalogId={params.catalogId}
				extantCategories={data.categories}
				defaultCategoryId={params.categoryId === 'Uncategorized' ? undefined : params.categoryId}
				{enhanceCallback}
			/>
		{:else}
			<CategoryForm
				catalogId={params.catalogId}
				existingCategory={data.category}
				{enhanceCallback}
			/>
		{/if}
	{/key}
</Modal>

{#key params.categoryId}
	{#if data.category}
		<div class="fixed z-2 top-2.5 right-4 invisible lg:visible">
			<TextTicker labels={relatedIdeas.map((idea) => idea.name)} period={5000} />
		</div>

		<section class="flex flex-col gap-4 m-3">
			<h1>{data.category.name}</h1>
			<pre>{data.category.desc}</pre>
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
					onclick={() => deleteCategoryIdeas(data.category)}
					title="Delete All Ideas"><i class="fi fi-rr-trash"></i>Delete All Ideas</Button
				>

				{#if params.categoryId !== 'Uncategorized'}
					<Button
						class="flex place-items-center w-max p-2"
						onclick={() => deleteCategory(data.category)}
						title="Delete Category"><i class="fi fi-rr-trash"></i>Delete Category</Button
					>
				{/if}
			</div>

			<IdeaList
				catalogId={params.catalogId}
				title="Contained Ideas"
				ideas={relatedIdeas}
				categoryId={data.category?.id}
			/>
		</section>
	{/if}
{/key}
