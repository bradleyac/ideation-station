<script lang="ts">
	import Collapse from '$lib/components/Collapse.svelte';
	import IdeaPreview from './ideas/IdeaPreview.svelte';
	import TextTicker from '$lib/components/TextTicker.svelte';
	import IdeaForm from './ideas/IdeaForm.svelte';
	import CategoryPreview from './categories/CategoryPreview.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';
	import CategoryForm from './categories/CategoryForm.svelte';
	import { type Idea } from '$lib/types.js';
	import { invalidateAll } from '$app/navigation';
	import { tooltipAttachment } from '$lib/attachments/floatingui.svelte';

	const { data } = $props();
	const aspirationsCategoryId = $derived(
		data.categories.find((cat) => cat.name === 'Aspirations')?.id ?? ''
	);

	let showIdeaModal = $state(false);
	let ideaKey = $state(0);

	let showCategoryModal = $state(false);
	let categoryKey = $state(0);

	let mode = $state<'default' | 'compact'>('default');

	let sort = $state<'alpha' | 'alphaR'>('alpha');

	const sortedIdeas = $derived(
		data.ideas.toSorted((a, b) =>
			sort === 'alpha'
				? a.name > b.name
					? 1
					: -1
				: sort === 'alphaR'
					? a.name > b.name
						? -1
						: 1
					: 0
		)
	);

	let idea = $state<Idea | undefined>(undefined);

	function setCurrent(id: string) {
		idea = data.ideas.filter((idea) => idea.id === id)[0];
	}

	let menu = $state<HTMLElement | null>(null);

	async function deleteIdea(idea: Idea) {
		if (confirm(`Really delete "${idea.name}"?`)) {
			await fetch(`/catalog/ideas/${idea.id}`, {
				method: 'DELETE'
			});
			invalidateAll();
		}
	}

	async function linkCategory(idea: Idea, categoryId: string) {
		await fetch(`/catalog/ideas/${idea.id}/categories/${categoryId}`, {
			method: 'PUT'
		});
		invalidateAll();
	}

	async function unlinkCategory(idea: Idea, categoryId: string) {
		if (confirm(`Really remove "${idea.name}" from category?`)) {
			await fetch(`/catalog/ideas/${idea.id}/categories/${categoryId}`, {
				method: 'DELETE'
			});
			invalidateAll();
		}
	}

	async function linkIdea(idea: Idea, otherIdea: { id: string; related: boolean }) {
		await fetch(`/catalog/ideas/${idea.id}/related/${otherIdea?.id}`, {
			method: 'PUT'
		});
		invalidateAll();
	}

	async function unlinkIdea(idea: Idea, otherIdea: { id: string; related: boolean }) {
		await fetch(`/catalog/ideas/${idea.id}/related/${otherIdea?.id}`, {
			method: 'DELETE'
		});
		invalidateAll();
	}
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

	<div
		bind:this={menu}
		class="absolute z-2 w-max max-w-full md:max-w-md top-0 left-0 hidden flex-col gap-4 bg-eucalyptus-200 dark:bg-eucalyptus-800 p-4"
	>
		{#if idea}
			{@render tooltip({ idea })}
		{/if}
	</div>

	{#snippet tooltip({
		idea,
		categoryId,
		otherIdea
	}: {
		idea: Idea;
		categoryId?: string;
		otherIdea?: { id: string; related: boolean };
	})}
		<pre class="pre-wrap">{idea.desc}</pre>
		<div class="flex w-full justify-end idea-preview-Buttons__container gap-2">
			<Button class="btn-primary" title="Delete Idea" onclick={() => deleteIdea(idea)}>
				<i class="fi fi-rr-trash"></i>
			</Button>
			{#if categoryId}
				{#if idea.categoryIds?.includes(categoryId)}
					<Button title="Remove From Category" onclick={unlinkCategory}>
						<i class="fi fi-rr-link-slash"></i>
					</Button>
				{:else}
					<Button title="Add To Category" onclick={linkCategory}>
						<i class="fi fi-rr-link"></i>
					</Button>
				{/if}
			{/if}
			{#if otherIdea}
				{#if otherIdea.related}
					<Button class="btn-primary" title="Unlink Related Idea" onclick={unlinkIdea}>
						<i class="fi fi-rr-link-slash"></i>
					</Button>
				{:else}
					<Button class="btn-primary" title="Link Related Idea" onclick={linkIdea}>
						<i class="fi fi-rr-link"></i>
					</Button>
				{/if}
			{/if}
		</div>
	{/snippet}

	<Collapse
		class="relative"
		title="All Ideas"
		open={true}
		{@attach tooltipAttachment({ tip: menu, setCurrent })}
	>
		<div class="absolute top-1.5 right-1.5 flex gap-1.5">
			<Button onclick={() => (mode = mode === 'default' ? 'compact' : 'default')}>{mode}</Button>
			<Button onclick={() => (sort = sort === 'alpha' ? 'alphaR' : 'alpha')}
				><i
					class={[
						'fi',
						sort === 'alpha' && 'fi-rr-sort-alpha-down',
						sort === 'alphaR' && 'fi-rr-sort-alpha-up'
					]}
				></i></Button
			>
		</div>
		<ul
			class={[
				'list-none flex',
				mode === 'default' && 'flex-row flex-wrap gap-2',
				mode === 'compact' && 'flex-col w-full divide-y'
			]}
		>
			{#each sortedIdeas as idea (idea.id)}
				<li class={[mode === 'compact' && 'ring-1']}>
					<IdeaPreview {idea} {mode} />
				</li>
			{/each}
		</ul>
	</Collapse>
</section>
