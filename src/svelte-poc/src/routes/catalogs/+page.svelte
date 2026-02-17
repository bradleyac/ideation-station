<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { getCatalogIds, upsertCatalog } from '$lib/remotes/catalog.remote';
	import CatalogForm from './CatalogForm.svelte';
	import CatalogPreview from './CatalogPreview.svelte';

	const { params, data, ...props } = $props();
	let showModal = $state(false);

	async function enhanceCallback(
		opts: Parameters<Parameters<typeof upsertCatalog.enhance>[0]>[0]
	): Promise<void> {
		await opts.submit();
		opts.form.reset();
		showModal = false;
	}
</script>

<svelte:head><title>Idea Catalogs</title></svelte:head>

<Modal bind:showModal>
	<CatalogForm {enhanceCallback} />
</Modal>

<section class="grid grid-cols-1 grid-rows-[auto_auto_1fr] gap-4 m-3 h-full">
	<h1>Idea Catalogs</h1>

	<div class="flex gap-2">
		<Button
			onclick={() => {
				showModal = !showModal;
			}}
			title="Create Catalog"><i class="block fi fi-rr-add"></i>New Catalog</Button
		>
	</div>

	<div
		class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-4 gap-4 h-full w-full"
	>
		<svelte:boundary>
			{#each await getCatalogIds() as catalogId (catalogId)}
				<CatalogPreview {catalogId} />
			{/each}
		</svelte:boundary>
	</div>
</section>
