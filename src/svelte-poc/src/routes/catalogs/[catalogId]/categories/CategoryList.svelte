<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Collapse from '$lib/components/Collapse.svelte';
	import PopoverMenuButton from '$lib/components/PopoverMenuButton.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { flip } from 'svelte/animate';
	import CategoryMenu from './CategoryMenu.svelte';
	import CategoryPreview from './CategoryPreview.svelte';

	const {
		categoryIds,
		allowAdd = false,
		...props
	}: {
		categoryIds: string[];
		allowAdd?: boolean;
		title: string;
		catalogId: string;
	} = $props();

	let mode = $state<'default' | 'compact'>('default');

	let sortDir = $state<'alpha' | 'alphaR'>('alpha');
	let shook = $state<'shake1' | 'shake2' | undefined>();
	let formKey = $state(0);

	function shake() {
		shook = shook === 'shake1' ? 'shake2' : 'shake1';
	}

	function sort() {
		sortDir = sortDir === 'alpha' ? 'alphaR' : 'alpha';
		shook = undefined;
	}

	// const sortedCategories = $derived(
	// 	categories.toSorted((a, b) =>
	// 		shook
	// 			? Math.random() - 0.5
	// 			: sortDir === 'alpha'
	// 				? a.name > b.name
	// 					? 1
	// 					: -1
	// 				: sortDir === 'alphaR'
	// 					? a.name > b.name
	// 						? -1
	// 						: 1
	// 					: 0
	// 	)
	// );

	const anyCategories = $derived(categoryIds?.length > 0);
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
			{#snippet children(categoryId: string)}
				<CategoryMenu {categoryId} />
			{/snippet}
		</Tooltip>
		<ul
			class={[
				'list-none flex relative',
				mode === 'default' && 'flex-row flex-wrap gap-2',
				mode === 'compact' && 'flex-col w-full divide-y'
			]}
		>
			{#each categoryIds as categoryId (categoryId)}
				<li animate:flip={{ duration: 500 }} class={[mode === 'compact' && 'ring-1']}>
					<CategoryPreview catalogId={props.catalogId} {categoryId} {mode} />
				</li>
			{/each}
			{#if allowAdd}
				<li>
					<PopoverMenuButton title="New Category" class="h-full">
						<i class="fi fi-rr-add"></i>New Category
						{#snippet menu(closePopover)}
							{#key formKey}
								<form
									class="flex flex-row gap-2 h-full shadow-black shadow-sm rounded-sm p-4 bg-eucalyptus-200 dark:bg-eucalyptus-800"
									action="/catalogs/{props.catalogId}/categories"
									method="POST"
									use:enhance={() => {
										return async ({ update, result }) => {
											if (result?.type === 'success') {
												closePopover();
												formKey++;
											}
											await update({ reset: false });
										};
									}}
								>
									<!-- svelte-ignore a11y_autofocus -->
									<input
										class="bg-neutral-300 dark:bg-neutral-700"
										required
										name="name"
										type="text"
										placeholder="New Category"
										autofocus
									/>
									<Button type="submit">OK</Button>
									<Button
										type="button"
										onclick={() => {
											closePopover();
											formKey++;
										}}><i class="fi fi-rr-cross"></i></Button
									>
								</form>
							{/key}
						{/snippet}
					</PopoverMenuButton>
				</li>
			{/if}
		</ul>
	</div>
</Collapse>
