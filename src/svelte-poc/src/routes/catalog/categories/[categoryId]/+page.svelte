<script lang="ts">
	import type { Idea } from '$lib/types.js';
	import IdeaPreview from '../../ideas/IdeaPreview.svelte';
	import IdeaForm from '../../ideas/IdeaForm.svelte';
	import TextTicker from '$lib/components/TextTicker.svelte';

	const { data, params } = $props();

	const relatedIdeas: Idea[] = $derived(
		data.ideas.filter((idea) => data.ideaIds.includes(idea.id))
	);
</script>

<svelte:head><title>{data.title}</title></svelte:head>

{#key params.categoryId}
	<div class="text-ticker__container">
		<TextTicker labels={relatedIdeas.map((idea) => idea.name)} period={5000} />
	</div>

	<section>
		<h1>{data.category.name}</h1>
		<div class="category__container">
			<IdeaForm
				extantCategories={data.categories}
				defaultCategoryId={params.categoryId === 'Uncategorized' ? undefined : params.categoryId}
			/>
			<ul>
				{#each relatedIdeas as idea (idea.id)}
					<li>
						<IdeaPreview
							{idea}
							categoryId={params.categoryId === 'Uncategorized' ? undefined : params.categoryId}
						/>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/key}

<style>
	.text-ticker__container {
		position: absolute;
		top: 0.75em;
		right: 1em;
	}

	.category__container {
		display: flex;
		flex-direction: row;
		gap: 2em;
		align-items: flex-start;
	}

	ul {
		list-style: none;
		gap: 1em;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 0;
		width: 100%;
	}
</style>
