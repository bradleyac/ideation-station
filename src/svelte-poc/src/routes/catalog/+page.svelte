<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Collapse from '$lib/components/Collapse.svelte';
	import type { Category, Idea } from '$lib/types.js';
	import IdeaPreview from './ideas/IdeaPreview.svelte';
	import TextTicker from '$lib/components/TextTicker.svelte';
	import IdeaForm from './ideas/IdeaForm.svelte';
	import CategoryPreview from './categories/CategoryPreview.svelte';
	import { tippyParent } from '$lib/attachments/tippy.svelte';

	const { data } = $props();
	const aspirationsCategoryId = $derived(
		data.categories.find((cat) => cat.name === 'Aspirations')!.id
	);
</script>

<svelte:head><title>Idea Catalog</title></svelte:head>
<section class="idea-catalog__container">
	<h1>Idea Catalog</h1>

	<div class="text-ticker__container">
		<TextTicker
			labels={data.ideas
				.filter((idea) => idea.categoryIds?.includes(aspirationsCategoryId))
				.map((idea) => idea.name)}
			period={5000}
		/>
	</div>

	<div class="idea-catalog__top">
		<IdeaForm extantCategories={data.categories} />
		<h2>Categories</h2>
		<ul class="category-list">
			{#each data.categories as category (category.id)}
				<li>
					<CategoryPreview {category} />
				</li>
			{/each}
		</ul>
	</div>

	<Collapse title="All Ideas" open={true}>
		<ul class="idea-list">
			{#each data.ideas as idea (idea.id)}
				<li>
					<IdeaPreview {idea} />
				</li>
			{/each}
		</ul>
	</Collapse>
</section>

<style>
	ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.text-ticker__container {
		position: absolute;
		top: 0.75em;
		right: 1em;
	}

	.idea-catalog__container {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.idea-list {
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1em;
	}

	.idea-catalog__top {
		display: flex;
		gap: 1em;
		max-width: 100%;
	}

	.category-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5em;
		align-content: start;
		position: relative;
		padding: 1em;
		margin: 0;
		list-style: none;
		overflow: hidden;
		border: solid 1px var(--color-primary-contrast);
		width: 100%;
		border-radius: 0.5em;

		li {
			max-width: min(20em, 100%);
		}
	}
</style>
