<script lang="ts">
	import Collapse from '$lib/components/Collapse.svelte';
	import IdeaPreview from './ideas/IdeaPreview.svelte';
	import TextTicker from '$lib/components/TextTicker.svelte';
	import IdeaForm from './ideas/IdeaForm.svelte';
	import CategoryPreview from './categories/CategoryPreview.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';

	const { data } = $props();
	const aspirationsCategoryId = $derived(
		data.categories.find((cat) => cat.name === 'Aspirations')!.id
	);

	let showModal = $state(false);
	let ideaKey = $state(0);
</script>

<svelte:head><title>Idea Catalog</title></svelte:head>

<Modal bind:showModal>
	{#key ideaKey}
		<IdeaForm extantCategories={data.categories} />
	{/key}
</Modal>

<section class="flex flex-col gap-4">
	<h1>Idea Catalog</h1>

	<Button
		onclick={() => {
			showModal = !showModal;
			ideaKey++;
		}}
		title="Open Create Idea Form"><i class="block fi fi-rr-add"></i>New Idea</Button
	>

	<div class="absolute top-3 right-4">
		<TextTicker
			labels={data.ideas
				.filter((idea) => idea.categoryIds?.includes(aspirationsCategoryId))
				.map((idea) => idea.name)}
			period={5000}
		/>
	</div>

	<Collapse title="All Categories" open={true}>
		<ul class="list-none m-0 gap-2 flex flex-row flex-wrap">
			{#each data.categories as category (category.id)}
				<li>
					<CategoryPreview {category} />
				</li>
			{/each}
		</ul>
	</Collapse>

	<Collapse title="All Ideas" open={true}>
		<ul class="list-none m-0 gap-2 flex flex-row flex-wrap">
			{#each data.ideas as idea (idea.id)}
				<li>
					<IdeaPreview {idea} />
				</li>
			{/each}
		</ul>
	</Collapse>
</section>
