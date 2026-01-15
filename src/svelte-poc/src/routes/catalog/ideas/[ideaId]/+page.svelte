<script lang="ts">
	import { type Category, type Idea as IdeaT } from '$lib/types.js';
	import Idea from '../Idea.svelte';
	import IdeaPreview from '../IdeaPreview.svelte';
	import { invalidate } from '$app/navigation';
	import Collapse from '$lib/components/Collapse.svelte';
	import IdeaForm from '../IdeaForm.svelte';
	import CategoryPreview from '../../categories/CategoryPreview.svelte';
	const { data } = $props();
	let editing = $state(false);
	let saving = $state(false);

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
</script>

<svelte:head><title>{data.title}</title></svelte:head>

{#key data.idea.id}
	<section class="idea__container">
		<button
			type="button"
			class="btn-primary"
			title="Edit Idea"
			style:display={editing ? 'none' : 'flex'}
			onclick={() => (editing = !editing)}><i class="fi fi-rr-edit"></i></button
		>

		{#if editing}
			<IdeaForm
				existingIdea={data.idea}
				extantCategories={data.categories}
				enhanceCallback={() => {
					saving = true;
					return async ({ update, result }) => {
						saving = false;
						if (result?.type === 'success') {
							editing = false;
						}
						invalidate('data:ideas');
						await update();
					};
				}}
			/>
		{:else}
			<Idea idea={data.idea} />
			<ul class="idea__categories">
				{#if !data.idea.categoryIds || data.idea.categoryIds.length === 0}
					<li>Uncategorized</li>
				{:else}
					{#each categories as category (category.id)}
						<li><CategoryPreview {category} /></li>
					{/each}
				{/if}
			</ul>
		{/if}

		<Collapse title="Related Ideas" open={data.relatedIdeas.length > 0}>
			<ul class="idea-list">
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
			<ul class="idea-list">
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

<style>
	.idea__container {
		display: flex;
		flex-direction: column;
		gap: 1em;
		margin: 1em 0;
	}

	.idea__categories {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: row;
		gap: 0.5em;

		li {
			max-width: min(20em, 100%);
		}
	}

	.idea-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 0;
		margin: 0;
		list-style-type: none;
		gap: 1em;
	}
</style>
