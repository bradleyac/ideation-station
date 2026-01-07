<script lang="ts">
	import type { Idea } from '$lib/data.svelte';
	const { idea }: { idea: Idea } = $props();
</script>

<h2>{idea.name}</h2>

<p>{idea.desc}</p>
