<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { getIdea, getRelatedIdeaIds, getUnrelatedIdeaIds } from '$lib/remotes/idea.remote.js';
	import { type Idea as IdeaT } from '$lib/types.js';
	import { type ActionResult } from '@sveltejs/kit';
	import CategoryPreview from '../../categories/CategoryPreview.svelte';
	import Idea from '../Idea.svelte';
	import IdeaForm from '../IdeaForm.svelte';
	import IdeaList from '../IdeaList.svelte';
	const { params } = $props();

	let showModal = $state(false);

	let ideaPromise = $derived(getIdea(params.ideaId));
	let relatedIdeaIdsPromise = $derived(getRelatedIdeaIds(params.ideaId));
	let unrelatedIdeaIdsPromise = $derived(getUnrelatedIdeaIds(params.ideaId));
	let idea = $derived(await ideaPromise);
	let relatedIdeaIds = $derived(await relatedIdeaIdsPromise);
	let unrelatedIdeaIds = $derived(await unrelatedIdeaIdsPromise);

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

<svelte:head><title>{idea?.name}</title></svelte:head>

<Modal bind:showModal>
	{#key params.ideaId}
		<IdeaForm catalogId={params.catalogId} existingIdeaId={params.ideaId} {enhanceCallback} />
	{/key}
</Modal>
<section class="flex flex-col gap-4 m-3">
	<svelte:boundary>
		{#snippet pending()}
			<Spinner />
		{/snippet}
		{#if idea}
			{#key idea.id}
				<Idea ideaId={params.ideaId} />

				<div class="flex flex-wrap gap-2">
					<Button type="button" title="Edit Idea" onclick={() => (showModal = !showModal)}
						><i class="fi fi-rr-edit"></i> Edit Idea</Button
					>

					<Button type="button" title="Delete Idea" onclick={() => deleteIdea(idea)}>
						<i class="fi fi-rr-trash"></i>Delete Idea</Button
					>
				</div>

				{#if idea.categoryId}
					<div class="w-max">
						<CategoryPreview categoryId={idea.categoryId} catalogId={params.catalogId} />
					</div>
				{/if}
			{/key}
		{:else}
			Idea not found.
		{/if}
		{#if relatedIdeaIds}
			<IdeaList
				catalogId={params.catalogId}
				title="Related Ideas"
				ideaIds={relatedIdeaIds}
				otherIdea={{ id: params.ideaId, related: true }}
			/>
		{/if}
		{#if unrelatedIdeaIds}
			<IdeaList
				catalogId={params.catalogId}
				title="Unrelated Ideas"
				ideaIds={unrelatedIdeaIds}
				otherIdea={{ id: params.ideaId, related: false }}
			/>
		{/if}
	</svelte:boundary>
</section>
