<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { getIdea, getRelatedIdeaIds, getUnrelatedIdeaIds } from '$lib/remotes/idea.remote.js';
	import { type Idea as IdeaT } from '$lib/types.js';
	import { type ActionResult } from '@sveltejs/kit';
	import CategoryPreview from '../../categories/CategoryPreview.svelte';
	import Idea from '../Idea.svelte';
	import IdeaForm from '../IdeaForm.svelte';
	import IdeaList from '../IdeaList.svelte';
	const { params } = $props();

	let idea = $derived(await getIdea(params.ideaId));

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

<svelte:head><title>{idea?.name}</title></svelte:head>

<Modal bind:showModal>
	{#key params.ideaId}
		<IdeaForm catalogId={params.catalogId} existingIdeaId={params.ideaId} {enhanceCallback} />
	{/key}
</Modal>
{#await idea}
	Loading...
{:then idea}
	{#if idea}
		{#key idea.id}
			<section class="flex flex-col gap-4 m-3">
				<Idea ideaId={params.ideaId} />

				<div class="flex flex-wrap gap-2">
					<Button type="button" title="Edit Idea" onclick={() => (showModal = !showModal)}
						><i class="text-lg fi fi-rr-edit"></i> Edit Idea</Button
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

				<!-- TODO Is this a waterfall or is it handled correctly? -->
				{#await getRelatedIdeaIds(params.ideaId)}
					Loading...
				{:then ideaIds}
					<IdeaList
						catalogId={params.catalogId}
						title="Related Ideas"
						{ideaIds}
						otherIdea={{ id: params.ideaId, related: true }}
					/>
				{/await}
				{#await getUnrelatedIdeaIds(params.ideaId)}
					Loading...
				{:then ideaIds}
					<IdeaList
						catalogId={params.catalogId}
						title="Unrelated Ideas"
						{ideaIds}
						otherIdea={{ id: params.ideaId, related: false }}
					/>
				{/await}
			</section>
		{/key}
	{:else}
		Idea not found.
	{/if}
{/await}
