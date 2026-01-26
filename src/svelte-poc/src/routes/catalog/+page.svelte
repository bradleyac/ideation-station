<script lang="ts">
	import Collapse from '$lib/components/Collapse.svelte';
	import IdeaPreview from './ideas/IdeaPreview.svelte';
	import TextTicker from '$lib/components/TextTicker.svelte';
	import IdeaForm from './ideas/IdeaForm.svelte';
	import CategoryPreview from './categories/CategoryPreview.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';
	import CategoryForm from './categories/CategoryForm.svelte';
	import { type Idea as IdeaT } from '$lib/types.js';
	import { invalidateAll } from '$app/navigation';
	import { tooltipAttachment } from '$lib/attachments/floatingui.svelte';
	import Idea from './ideas/Idea.svelte';
	import IdeaMenu from './ideas/IdeaMenu.svelte';
	import IdeaList from './ideas/IdeaList.svelte';

	const { data } = $props();
	const aspirationsCategoryId = $derived(
		data.categories.find((cat) => cat.name === 'Aspirations')?.id ?? ''
	);

	let showIdeaModal = $state(false);
	let ideaKey = $state(0);

	let showCategoryModal = $state(false);
	let categoryKey = $state(0);
</script>

<svelte:head><title>Idea Catalog</title></svelte:head>

<Modal bind:showModal={showIdeaModal}>
	{#key ideaKey}
		<IdeaForm extantCategories={data.categories} />
	{/key}
</Modal>

<Modal bind:showModal={showCategoryModal}>
	{#key categoryKey}
		<CategoryForm />
	{/key}
</Modal>

<section class="flex flex-col gap-4 m-3">
	<h1>Idea Catalog</h1>

	<div class="flex gap-2">
		<Button
			onclick={() => {
				showIdeaModal = !showIdeaModal;
				ideaKey++;
			}}
			title="Open Create Idea Form"><i class="block fi fi-rr-add"></i>New Idea</Button
		>

		<Button
			onclick={() => {
				showCategoryModal = !showCategoryModal;
				categoryKey++;
			}}
			title="Open Create Category Form"><i class="block fi fi-rr-add"></i>New Category</Button
		>
	</div>

	<div class="top-2.5 right-4 invisible lg:visible z-2 fixed">
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

	<IdeaList title="All Ideas" ideas={data.ideas} />
</section>
