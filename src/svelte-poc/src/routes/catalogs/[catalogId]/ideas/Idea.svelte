<script lang="ts">
	import ImageViewer from '$lib/components/ImageViewer.svelte';
	import { getIdea } from '$lib/remotes/idea.remote';

	const props: { ideaId: string } = $props();
	let idea = $derived(await getIdea(props.ideaId));
</script>

<div class="flex flex-col min-w-xs md:min-w-sm gap-2">
	{#if idea}
		<h2 class="text-lg">{idea.name}</h2>

		<pre>{idea.desc}</pre>

		{#if idea.imgUrl}
			<div class="max-w-full min-[32rem]:max-w-lg flex">
				<ImageViewer src={idea.imgUrl} alt="User-Uploaded Content" />
			</div>
		{/if}
	{:else}
		Idea not found.
	{/if}
</div>
