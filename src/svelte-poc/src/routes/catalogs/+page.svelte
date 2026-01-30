<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import CatalogForm from './CatalogForm.svelte';

	const { params, data, ...props } = $props();
	let showModal = $state(false);
	let catalogKey = $state(0);

	function enhanceCallback(): ({
		update,
		result
	}: {
		update: () => Promise<void>;
		result: ActionResult;
	}) => Promise<void> {
		return async ({ update, result }) => {
			if (result?.type === 'success') {
				showModal = false;
				await invalidateAll();
			}
			await update();
		};
	}
</script>

<svelte:head><title>Idea Catalogs</title></svelte:head>

<Modal bind:showModal>
	{#key catalogKey}
		<CatalogForm {enhanceCallback} />
	{/key}
</Modal>

<section class="flex flex-col gap-4 m-3">
	<h1>Idea Catalogs</h1>

	<div class="flex gap-2">
		<Button
			onclick={() => {
				showModal = !showModal;
				catalogKey++;
			}}
			title="Open Create Catalog Form"><i class="block fi fi-rr-add"></i>New Catalog</Button
		>
	</div>

	<div class="flex">
		{#each data.catalogs as catalog (catalog.id)}
			<div class="flex flex-col">
				<a href="/catalogs/{catalog.id}"><h2>{catalog.name}</h2></a>
				<pre>{catalog.desc}</pre>
			</div>
		{/each}
	</div>

	<!-- <CategoryList catalogId={params.catalogId} title="All Categories" categories={data.categories} />

	<IdeaList catalogId={params.catalogId} title="All Ideas" ideas={data.ideas} /> -->
</section>
