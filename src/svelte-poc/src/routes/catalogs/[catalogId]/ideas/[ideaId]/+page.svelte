<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { getIdeas } from '$lib/remotes/idea.remote.js';
	import { type Idea as IdeaT } from '$lib/types.js';
	import { type ActionResult } from '@sveltejs/kit';
	import CategoryPreview from '../../categories/CategoryPreview.svelte';
	import Idea from '../Idea.svelte';
	import IdeaForm from '../IdeaForm.svelte';
	import IdeaList from '../IdeaList.svelte';
	const { data, params } = $props();

	const allIdeas = $derived(await getIdeas(params.catalogId));

	const unrelatedIdeas: IdeaT[] = $derived(
		allIdeas.filter(
			(possiblyRelatedIdea) =>
				!(
					data.idea.id == possiblyRelatedIdea.id ||
					data.relatedIdeas.map((relatedIdea) => relatedIdea.id).includes(possiblyRelatedIdea.id)
				)
		)
	);

	const category = $derived(data.categories.find((c) => c.id === data.idea.categoryId));

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
		if (confirm(`Really delete "${data.idea.name}"?`)) {
			await fetch(`/catalogs/${params.catalogId}/ideas/${data.idea.id}`, {
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

		<div class="flex flex-wrap gap-2">
			<Button type="button" title="Edit Idea" onclick={() => (showModal = !showModal)}
				><i class="text-lg fi fi-rr-edit"></i> Edit Idea</Button
			>

			<Button type="button" title="Delete Idea" onclick={deleteIdea}>
				<i class="fi fi-rr-trash"></i>Delete Idea</Button
			>
		</div>

		{#if category}
			<div class="w-max">
				<CategoryPreview {category} catalogId={params.catalogId} />
			</div>
		{/if}

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
