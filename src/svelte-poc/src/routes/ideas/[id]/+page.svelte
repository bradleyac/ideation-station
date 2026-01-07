<script lang="ts">
	import { type Idea as IdeaT } from '$lib/data.svelte';
	import Idea from '../Idea.svelte';
	import IdeaPreview from '../IdeaPreview.svelte';
	import { invalidate } from '$app/navigation';
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

	async function addRelatedIdea(relatedIdea: IdeaT) {
		await fetch(`/api/idea/${data.idea.id}/relatesTo/${relatedIdea.id}`, {
			method: 'PUT'
		});

		invalidate('data:ideas');
	}

	async function removeRelatedIdea(relatedIdea: IdeaT) {
		await fetch(`/api/idea/${data.idea.id}/relatesTo/${relatedIdea.id}`, {
			method: 'DELETE'
		});

		invalidate('data:ideas');
	}
</script>

<svelte:head><title>{data.title}</title></svelte:head>

<Idea idea={data.idea} />

<section>
	<h2>Related Ideas</h2>
	<ul class="idea-list">
		{#each data.relatedIdeas as otherIdea (otherIdea.id)}
			<button onclick={() => removeRelatedIdea(otherIdea)}><IdeaPreview idea={otherIdea} /></button>
		{/each}
	</ul>
</section>

<section>
	<h2>Unrelated Ideas</h2>
	<ul class="idea-list">
		{#each unrelatedIdeas as otherIdea (otherIdea.id)}
			<button onclick={() => addRelatedIdea(otherIdea)}><IdeaPreview idea={otherIdea} /></button>
		{/each}
	</ul>
</section>

<style>
	.idea-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 0;
		margin: 0;
		list-style-type: none;
		gap: 1em;

		button {
			border: none;
			padding: 0;
			background-color: transparent;
		}
	}
</style>
