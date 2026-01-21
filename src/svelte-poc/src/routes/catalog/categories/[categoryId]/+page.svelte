<script lang="ts">
	import type { Idea } from '$lib/types.js';
	import IdeaPreview from '../../ideas/IdeaPreview.svelte';
	import IdeaForm from '../../ideas/IdeaForm.svelte';
	import TextTicker from '$lib/components/TextTicker.svelte';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';

	const { data, params } = $props();

	const relatedIdeas: Idea[] = $derived(
		data.ideas.filter((idea) => data.ideaIds.includes(idea.id))
	);

	let showModal = $state(false);
	let ideaKey = $state(0);
</script>

<svelte:head><title>{data.title}</title></svelte:head>

<Modal bind:showModal>
	{#key ideaKey}
		<IdeaForm
			extantCategories={data.categories}
			defaultCategoryId={params.categoryId === 'Uncategorized' ? undefined : params.categoryId}
		/>
	{/key}
</Modal>

{#key params.categoryId}
	<div class="absolute top-3 right-4">
		<TextTicker labels={relatedIdeas.map((idea) => idea.name)} period={5000} />
	</div>

	<section class="flex flex-col gap-4">
		<h1>{data.category.name}</h1>
		<Button
			class="flex place-items-center w-max p-2"
			onclick={() => {
				showModal = !showModal;
				ideaKey++;
			}}
			title="Open Create Idea Form"><i class="block fi fi-rr-add"></i>New Idea</Button
		>
		<ul class="flex gap-2 flex-wrap">
			{#each relatedIdeas as idea (idea.id)}
				<li>
					<IdeaPreview
						{idea}
						categoryId={params.categoryId === 'Uncategorized' ? undefined : params.categoryId}
					/>
				</li>
			{/each}
		</ul>
	</section>
{/key}
