<script lang="ts">
	import { invalidate } from '$app/navigation';
	import IdeaPreview from './IdeaPreview.svelte';
	import NewIdeaForm from './NewIdeaForm.svelte';

	const { data } = $props();

	async function deleteIdea(id: string): Promise<void> {
		await fetch(`api/idea/${id}`, {
			method: 'DELETE'
		});
		await invalidate('data:ideas');
	}
</script>

<svelte:head><title>Idea Catalog</title></svelte:head>

<section class="idea-catalog__container">
	<h1>Welcome to the Idea Catalog!</h1>

	<div class="idea-catalog__top">
		<NewIdeaForm />
		<ul class="ideas__container">
			{#each data.ideas.values() as idea}
				<li class="idea__item">
					<p class="idea__badge">{idea.name}</p>
				</li>
			{/each}
		</ul>
	</div>

	<details open>
		<summary>Ideas</summary>
		<ul class="idea-preview__container">
			{#each data.ideas.entries() as [_, idea] (idea.id)}
				<li class="idea-preview__item">
					<a href="ideas/{idea.id}"><IdeaPreview {idea} /></a>
					<button class="btn-primary" title="Delete Idea" onclick={() => deleteIdea(idea.id)}
						><i class="fi fi-rr-trash"></i></button
					>
				</li>
			{/each}
		</ul>
	</details>
</section>

<style>
	ul {
		list-style-type: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	a {
		text-decoration: none;
		color: inherit;

		&:hover {
			--cbg-color: oklch(from var(--bg-color) calc(l + 0.1) c h);
		}
	}

	.idea-catalog__container {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.idea-preview__container {
		flex-direction: row;
		flex-wrap: wrap;
		margin: 1em;
		gap: 1em;
	}

	.idea-preview__item {
		display: flex;
		flex-direction: row;
		border-radius: 1em;
		box-shadow: 0 0 1px black;

		button {
			border-radius: 0 1em 1em 0;
			display: flex;
			place-items: center;
		}
	}

	.idea-catalog__top {
		display: flex;
		gap: 1em;
		max-width: 100%;
	}

	.ideas__container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5em;
		align-content: start;
		position: relative;
		padding: 1em;
		margin: 0;
		list-style: none;
		overflow: hidden;
		border: solid 1px var(--color-primary-contrast);
		width: 100%;
		border-radius: 0.5em;

		li,
		p {
			margin: 0;
			display: block;
			height: max-content;
			width: max-content;
		}

		.idea__item {
			position: relative;
			text-overflow: ellipsis;
			text-wrap: nowrap;
			max-width: min(20em, 100%);

			.idea__badge {
				background-color: var(--color-primary);
				padding: 0.5em;
				border-radius: 0.5em;
				text-overflow: ellipsis;
				text-wrap: nowrap;
				overflow: hidden;
				max-width: 100%;
				&:hover {
					box-shadow: 0 0 0.25em 0 black;
					z-index: 1;
					transform: scale(1.05);
				}
			}
		}
	}
</style>
