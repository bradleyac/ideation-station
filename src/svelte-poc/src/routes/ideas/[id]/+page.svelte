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

<section class="idea__container">
	<Idea idea={data.idea} />

	<ul>
		{#each data.idea.categories?.entries() as [i, category] (i)}
			<li>{category}</li>
		{/each}
	</ul>

	<details open={data.relatedIdeas.length > 0}>
		<summary>Related Ideas</summary>
		<ul class="idea-list">
			{#if data.relatedIdeas.length === 0}
				<p>No related ideas found.</p>
			{:else}
				{#each data.relatedIdeas as otherIdea (otherIdea.id)}
					<li class="idea-preview__item">
						<a href="/ideas/{otherIdea.id}"><IdeaPreview idea={otherIdea} /></a>
						<button
							class="btn-primary"
							title="Mark Unrelated"
							onclick={() => removeRelatedIdea(otherIdea)}
							><i class="fi fi-rr-link-slash"></i></button
						>
					</li>
				{/each}
			{/if}
		</ul>
	</details>

	<details>
		<summary>Unrelated Ideas</summary>
		<ul class="idea-list">
			{#if unrelatedIdeas.length === 0}
				<p>No unrelated ideas found.</p>
			{:else}
				{#each unrelatedIdeas as otherIdea (otherIdea.id)}
					<li class="idea-preview__item">
						<a href="/ideas/{otherIdea.id}"><IdeaPreview idea={otherIdea} /></a>
						<button
							class="btn-primary"
							style:place-items="center"
							title="Mark Related"
							onclick={() => addRelatedIdea(otherIdea)}><i class="fi fi-rr-link"></i></button
						>
					</li>
				{/each}
			{/if}
		</ul>
	</details>
</section>

<style>
	.idea__container {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.idea-preview__item {
		display: flex;
		flex-direction: row;
		border-radius: 1em;
		box-shadow: 0 0 1px 0px black;

		button {
			border-radius: 0 1em 1em 0;
			display: flex;
			place-items: center;
		}

		a {
			text-decoration: none;
			color: inherit;

			&:hover {
				--cbg-color: oklch(from var(--bg-color) calc(l + 0.1) c h);
			}
		}
	}

	.idea-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 0;
		margin: 1em;
		list-style-type: none;
		gap: 1em;
	}
</style>
