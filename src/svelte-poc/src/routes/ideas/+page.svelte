<script>
	import { enhance } from '$app/forms';
	import IdeaPreview from './IdeaPreview.svelte';

	const { data } = $props();
</script>

<h1>Welcome to the Idea Catalog!</h1>

<form method="POST" use:enhance>
	<h2>New Idea</h2>
	<label>
		Name:
		<input name="name" type="text" placeholder="Idea name" />
	</label>

	<label>
		Text
		<input name="text" type="text" placeholder="Idea details" />
	</label>
	<button type="submit">Submit</button>
</form>

<div>
	<h2>Ideas</h2>
	<ul>
		{#each data.localIdeas.entries() as [id, idea] (id)}
			<li>
				<a href="ideas/{id}"><IdeaPreview {idea} /></a>
			</li>
		{/each}
	</ul>
</div>

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
</style>
