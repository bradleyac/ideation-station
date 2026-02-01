<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Collapse from '$lib/components/Collapse.svelte';
	import { type Category } from '$lib/types';
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
		catalogId: string;
	} = $props();

	let mode = $state<'default' | 'compact'>('default');

	let sortDir = $state<'alpha' | 'alphaR'>('alpha');
	let shook = $state<'shake1' | 'shake2' | undefined>();

	function shake() {
		shook = shook === 'shake1' ? 'shake2' : 'shake1';
	}

	function sort() {
		sortDir = sortDir === 'alpha' ? 'alphaR' : 'alpha';
		shook = undefined;
	}

	const sortedCategories = $derived(
		categories.toSorted((a, b) =>
			shook
				? Math.random() - 0.5
				: sortDir === 'alpha'
					? a.name > b.name
						? 1
						: -1
					: sortDir === 'alphaR'
						? a.name > b.name
							? -1
							: 1
						: 0
		)
	);

	const anyCategories = $derived(categories?.length > 0);
	let container = $state<HTMLElement>();
</script>

<Collapse class="relative" title={props.title} open={anyCategories} disabled={!anyCategories}>
	<div class="absolute top-1.5 right-1.5 flex gap-1.5">
		<Button
			title={mode === 'default' ? 'Fluid' : 'Compact'}
			onclick={() => (mode = mode === 'default' ? 'compact' : 'default')}
			><i
				class={[
					'fi',
					mode === 'default' && 'fi-rr-layout-fluid',
					mode === 'compact' && 'fi-rr-table-list'
				]}
			></i></Button
		>
		<div class="flex">
			<Button lit={!!shook} rounded="start" onclick={shake} title="Shuffle"
				><i class="fi fi-rr-shuffle"></i></Button
			>
			<Button lit={!shook} rounded="end" onclick={sort} title="Sort"
				><i
					class={[
						'fi',
						sortDir === 'alpha' && 'fi-rr-sort-alpha-down',
						sortDir === 'alphaR' && 'fi-rr-sort-alpha-up'
					]}
				></i></Button
			>
		</div>
	</div>
	<div bind:this={container} class={['relative flex flex-col w-full', mode === 'default' && 'm-2']}>
		<Tooltip parent={container}>
			{#snippet children(id: string)}
				<CategoryMenu category={categories.filter((cat) => cat.id === id)[0]} />
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
					<CategoryPreview catalogId={props.catalogId} {category} {mode} />
				</li>
			{/each}
		</ul>
	</div>
</Collapse>
