<script lang="ts">
	import { type Category, type Idea as IdeaT } from '$lib/types.js';
	import Idea from '../Idea.svelte';
	import IdeaPreview from '../IdeaPreview.svelte';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import Collapse from '$lib/components/Collapse.svelte';
	import IdeaForm from '../IdeaForm.svelte';
	import CategoryPreview from '../../categories/CategoryPreview.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { redirect, type ActionResult } from '@sveltejs/kit';
	import Button from '$lib/components/Button.svelte';
	import IdeaList from '../IdeaList.svelte';
	import CategoryList from '../../categories/CategoryList.svelte';
	const { data, params } = $props();

	const unrelatedIdeas: IdeaT[] = $derived(
		data.ideas.filter(
			(possiblyRelatedIdea) =>
				!(
					data.idea.id == possiblyRelatedIdea.id ||
					data.relatedIdeas.map((relatedIdea) => relatedIdea.id).includes(possiblyRelatedIdea.id)
				)
		)
	);

	const categories: Category[] = $derived(
		data.idea.categoryIds
			.map((catId) => data.categories.find((c) => c.id === catId))
			.filter((c): c is Category => c !== undefined)
	);

	let showModal = $state(false);

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

	async function deleteIdea(idea: IdeaT) {
		if (confirm(`Really delete "${idea.name}"?`)) {
			await fetch(`/catalogs/${params.catalogId}/ideas/${idea.id}`, {
				method: 'DELETE'
			});
			await goto(`/catalogs/${params.catalogId}`);
			await invalidateAll();
		}
	}
</script>

<svelte:head><title>{data.title}</title></svelte:head>

<Modal bind:showModal>
	{#key data.idea}
		<IdeaForm
			catalogId={params.catalogId}
			existingIdea={data.idea}
			extantCategories={data.categories}
			{enhanceCallback}
		/>
	{/key}
</Modal>
{#key data.idea.id}
	<section class="flex flex-col gap-4 m-3">
		<Idea idea={data.idea} />

		<div class="flex gap-2">
			<Button type="button" title="Edit Idea" onclick={() => (showModal = !showModal)}
				><i class="fi fi-rr-edit"></i> Edit Idea</Button
			>

			<Button type="button" title="Delete Idea" onclick={deleteIdea}>
				<i class="fi fi-rr-trash"></i>Delete Idea</Button
			>
		</div>

		<CategoryList catalogId={params.catalogId} title="Categories" {categories} />

		<IdeaList
			catalogId={params.catalogId}
			title="Related Ideas"
			ideas={data.relatedIdeas}
			otherIdea={{ id: data.idea.id, related: true }}
		/>
		<IdeaList
			catalogId={params.catalogId}
			title="Unrelated Ideas"
			ideas={unrelatedIdeas}
			otherIdea={{ id: data.idea.id, related: false }}
		/>
	</section>
{/key}
