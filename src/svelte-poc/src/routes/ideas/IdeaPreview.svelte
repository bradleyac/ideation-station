<script lang="ts">
	import type { Idea } from '$lib/data.svelte';
	const { idea }: { idea: Idea } = $props();
</script>

<div>
	<p>{idea.name}</p>
</div>

<style>
	div {
		border-radius: 1em 0 0 1em;
		padding: 1em;
		background-color: var(--cbg-color, var(--bg-color));
		position: relative;

		display: flex;
		gap: 1em;
		flex-direction: column;

		p {
			margin: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			text-wrap: nowrap;
		}
	}
</style>
