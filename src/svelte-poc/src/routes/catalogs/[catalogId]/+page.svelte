<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import CategoryDndZone from '$lib/components/dnd/CategoryDndZone.svelte';
	import DeleteIdeaDndZone from '$lib/components/dnd/DeleteIdeaDndZone.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { deleteCatalog, getCatalog, upsertCatalog } from '$lib/remotes/catalog.remote';
	import { getCategoryIds } from '$lib/remotes/category.remote';
	import CatalogForm from '../CatalogForm.svelte';
	import CategoryForm from './categories/CategoryForm.svelte';
	import IdeaForm from './ideas/IdeaForm.svelte';

	const { data, params, ...props } = $props();
	// const aspirationsCategoryId = $derived(
	// 	data.categories.find((cat) => cat.name === 'Aspirations')?.id ?? ''
	// );

	let showModal = $state(false);
	let modalKey = $state(0);
	let whichModal = $state<'edit' | 'category' | 'idea'>('edit');
	// let sortedCategories = $derived(data.categories.toSorted((a, b) => (a.name > b.name ? 1 : -1)));
	let catalogPromise = $derived(getCatalog(params.catalogId));
	let categoryIdsPromise = $derived(getCategoryIds(params.catalogId));
	let catalog = $derived(await catalogPromise);
	let categoryIds = $derived(await categoryIdsPromise);
	let connections = $derived(catalog?.settings?.connections ?? false);

	async function confirmDeleteCatalog() {
		if (!catalog) return;
		if (confirm(`Really delete "${catalog.name}"?`)) {
			await deleteCatalog(catalog.id);
			await goto('/catalogs');
		}
	}

	// TODO: This doesn't work for all 3 forms.
	async function enhanceCallback(
		opts: Parameters<Parameters<typeof upsertCatalog.enhance>[0]>[0]
	): Promise<void> {
		await opts.submit();
		opts.form.reset();
		showModal = false;
	}
</script>

<svelte:head><title>Idea Catalog</title></svelte:head>

<Modal bind:showModal>
	{#key modalKey}
		{#if whichModal === 'idea'}
			<IdeaForm catalogId={params.catalogId} />
		{:else if whichModal === 'category'}
			<CategoryForm catalogId={params.catalogId} {enhanceCallback} />
		{:else if whichModal === 'edit'}
			<CatalogForm existingCatalogId={params.catalogId} {enhanceCallback} />
		{/if}
	{/key}
</Modal>

<svelte:boundary>
	{#if catalog}
		<section class="flex flex-col gap-4 p-3">
			<h1>{catalog.name}</h1>
			<pre>{catalog.desc}</pre>

			<div class="flex flex-wrap gap-2">
				<Button
					onclick={() => {
						showModal = true;
						modalKey++;
						whichModal = 'edit';
					}}
					title="Edit Catalog"><i class="fi fi-rr-edit"></i>Edit Catalog</Button
				>

				<Button onclick={confirmDeleteCatalog} title="Delete Catalog"
					><i class="fi fi-rr-trash"></i>Delete Catalog</Button
				>

				<Button
					onclick={() => {
						showModal = true;
						modalKey++;
						whichModal = 'idea';
					}}
					title="Create Idea"><i class="fi fi-rr-add"></i>New Idea</Button
				>

				<Button
					onclick={() => {
						showModal = true;
						modalKey++;
						whichModal = 'category';
					}}
					title="Create Category"><i class="fi fi-rr-add"></i>New Category</Button
				>
				{#if connections}
					<form action="/catalogs/{params.catalogId}?/loadConnections" method="POST" use:enhance>
						<input type="text" name="dummy" value="dummy" class="hidden" />
						<Button type="submit"><i class="fi fi-rr-add"></i>From Connections</Button>
					</form>
				{/if}
			</div>

			<!-- {#if aspirationsCategoryId}
			<div class="top-2.5 right-4 invisible lg:visible z-2 fixed">
				<TextTicker
					period={5000}
					labels={allIdeas
						.filter((idea) => idea.categoryId === aspirationsCategoryId)
						.map((idea) => idea.name)}
				/>
			</div>
		{/if} -->

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[20rem] gap-4">
				<svelte:boundary>
					{#snippet pending()}
						<Spinner />
					{/snippet}
					{#each categoryIds as categoryId (categoryId)}
						<CategoryDndZone {connections} {categoryId} catalogId={params.catalogId} />
					{/each}
					<DeleteIdeaDndZone catalogId={params.catalogId} />
				</svelte:boundary>
			</div>
		</section>
	{:else}
		Catalog not found.
	{/if}
</svelte:boundary>
