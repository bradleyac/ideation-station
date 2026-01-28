<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Collapse from '$lib/components/Collapse.svelte';
	import { type Category, type Idea as IdeaT } from '$lib/types';
	import { flip } from 'svelte/animate';
	import CategoryPreview from './CategoryPreview.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import CategoryMenu from './CategoryMenu.svelte';

	const {
		categories,
		...props
	}: {
		categories: Category[];
		title: string;
	} = $props();

	let mode = $state<'default' | 'compact'>('default');

	let sort = $state<'alpha' | 'alphaR' | 'shake1' | 'shake2'>('alpha');

	const sortedCategories = $derived(
		categories.toSorted((a, b) =>
			sort === 'alpha'
				? a.name > b.name
					? 1
					: -1
				: sort === 'alphaR'
					? a.name > b.name
						? -1
						: 1
					: sort === 'shake1' || sort === 'shake2'
						? Math.random() - 0.5
						: 0
		)
	);

	let menu = $state<HTMLElement>();
	const anyCategories = $derived(categories?.length > 0);
	let container = $state<HTMLElement>();
</script>

<Collapse class="relative" title={props.title} open={anyCategories} disabled={!anyCategories}>
	<div class="absolute top-1.5 right-1.5 flex gap-1.5">
		<Button onclick={() => (mode = mode === 'default' ? 'compact' : 'default')}>{mode}</Button>
		<Button onclick={() => (sort = sort === 'shake1' ? 'shake2' : 'shake1')}>Shake!</Button>
		<Button onclick={() => (sort = sort === 'alpha' ? 'alphaR' : 'alpha')}
			><i
				class={[
					'fi',
					sort === 'alpha' && 'fi-rr-sort-alpha-down',
					sort === 'alphaR' && 'fi-rr-sort-alpha-up',
					(sort === 'shake1' || sort === 'shake2') && 'fi-rr-scribble'
				]}
			></i></Button
		>
	</div>
	<div bind:this={container} class="relative flex flex-col w-full">
		<Tooltip parent={container}>
			{#snippet children(id: string)}
				<CategoryMenu bind:ref={menu} category={categories.filter((cat) => cat.id === id)[0]} />
			{/snippet}
		</Tooltip>
		<ul
			class={[
				'list-none flex',
				mode === 'default' && 'flex-row flex-wrap gap-2',
				mode === 'compact' && 'flex-col w-full divide-y'
			]}
		>
			{#each sortedCategories as category (category.id)}
				<li animate:flip={{ duration: 500 }} class={[mode === 'compact' && 'ring-1']}>
					<CategoryPreview {category} {mode} />
				</li>
			{/each}
		</ul>
	</div>
</Collapse>
