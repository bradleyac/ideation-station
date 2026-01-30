<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import CatalogForm from './CatalogForm.svelte';
	import CatalogPreview from './CatalogPreview.svelte';

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
			title="Create Catalog"><i class="block fi fi-rr-add"></i>New Catalog</Button
		>
	</div>

	<div
		class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-max sm:auto-rows-fr gap-4"
	>
		{#each data.catalogs as catalog (catalog.id)}
			<CatalogPreview {catalog} />
		{/each}
	</div>
</section>
