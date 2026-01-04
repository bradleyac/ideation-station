<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Idea } from '$lib/data.svelte';
	const { idea }: { idea: Idea } = $props();
</script>

<section>
	<h2>{idea.name}</h2>
	<p>{idea.text}</p>
</section>

<style>
	section {
		border-radius: 1em;
		border: solid 1px var(--color-primary, black);
		padding: 1em;
		background-color: var(--cbg-color, var(--bg-color));

		display: flex;
		gap: 1em;
		flex-direction: column;

		h2,
		p {
			margin: 0;
		}
	}
</style>
