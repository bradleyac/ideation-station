<script lang="ts">
	import { getIdea } from '$lib/remotes/idea.remote';

	const props: { ideaId: string } = $props();
</script>

<div class="flex flex-col min-w-xs md:min-w-sm gap-2">
	{#await getIdea(props.ideaId)}
		Loading...
	{:then idea}
		{#if idea}
			<h2 class="text-lg">{idea.name}</h2>

			<pre>{idea.desc}</pre>
		{:else}
			Idea not found.
		{/if}
	{/await}
</div>
