<script lang="ts">
	import type { Idea } from '$lib/types.js';
	const { idea }: { idea: Idea } = $props();
</script>

<h2>{idea.name}</h2>

<pre>{idea.desc}</pre>
