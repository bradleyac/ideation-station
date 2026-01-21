<script lang="ts">
	import { type Category, type Idea as IdeaT } from '$lib/types.js';
	import Idea from '../Idea.svelte';
	import IdeaPreview from '../IdeaPreview.svelte';
	import { invalidate } from '$app/navigation';
	import Collapse from '$lib/components/Collapse.svelte';
	import IdeaForm from '../IdeaForm.svelte';
	import CategoryPreview from '../../categories/CategoryPreview.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import Button from '$lib/components/Button.svelte';
	const { data } = $props();

	const unrelatedIdeas: IdeaT[] = $derived(
		data.ideas.filter(
			(idea) =>
				!(
					idea.id == data.idea.id ||
					data.relatedIdeas.map((relatedIdea) => relatedIdea.id).includes(idea.id)
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
				invalidate('data:ideas');
			}
			await update();
		};
	}
</script>

<svelte:head><title>{data.title}</title></svelte:head>

<Modal bind:showModal>
	{#key data.idea}
		<IdeaForm existingIdea={data.idea} extantCategories={data.categories} {enhanceCallback} />
	{/key}
</Modal>

{#key data.idea.id}
	<section class="flex flex-col gap-4 m-3">
		<Button type="button" title="Edit Idea" onclick={() => (showModal = !showModal)}
			><i class="fi fi-rr-edit"></i> Edit Idea</Button
		>

		<Idea idea={data.idea} />

		<ul class="flex gap-2 flex-wrap">
			{#if !data.idea.categoryIds || data.idea.categoryIds.length === 0}
				<li>Uncategorized</li>
			{:else}
				{#each categories as category (category.id)}
					<li><CategoryPreview {category} /></li>
				{/each}
			{/if}
		</ul>

		<Collapse title="Related Ideas" open={data.relatedIdeas.length > 0}>
			<ul class="flex flex-wrap gap-2">
				{#if data.relatedIdeas.length === 0}
					<p>No related ideas found.</p>
				{:else}
					{#each data.relatedIdeas as relatedIdea (relatedIdea.id)}
						<li>
							<IdeaPreview idea={relatedIdea} otherIdea={{ id: data.idea.id, related: true }} />
						</li>
					{/each}
				{/if}
			</ul>
		</Collapse>

		<Collapse title="Unrelated Ideas">
			<ul class="flex flex-wrap gap-2">
				{#if unrelatedIdeas.length === 0}
					<p>No unrelated ideas found.</p>
				{:else}
					{#each unrelatedIdeas as unrelatedIdea (unrelatedIdea.id)}
						<li>
							<IdeaPreview idea={unrelatedIdea} otherIdea={{ id: data.idea.id, related: false }} />
						</li>
					{/each}
				{/if}
			</ul>
		</Collapse>
	</section>
{/key}
