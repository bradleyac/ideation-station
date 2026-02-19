<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getCatalog, upsertCatalog } from '$lib/remotes/catalog.remote';
	const props: {
		existingCatalogId?: string;
		enhanceCallback?: Parameters<typeof upsertCatalog.enhance>[0];
	} = $props();
	let title = $derived(props.existingCatalogId ? 'Edit Catalog' : 'Create New Catalog');

	$inspect(props.existingCatalogId);

	let existingCatalog = $derived(
		props.existingCatalogId !== undefined ? await getCatalog(props.existingCatalogId) : undefined
	);

	const { id, name, desc, settings } = upsertCatalog.fields;
</script>

<form
	class="flex flex-col overflow-clip min-[32rem]:rounded-sm w-full max-w-lg"
	{...upsertCatalog.enhance(props.enhanceCallback ?? (async (opts) => await opts.submit()))}
>
	<h2 class="bg-eucalyptus-300 dark:bg-eucalyptus-700 p-3">{title}</h2>
	<div class="bg-neutral-200 dark:bg-neutral-800 p-3 gap-4 flex flex-col">
		<input hidden {...id.as('text')} value={props.existingCatalogId} />
		<label>
			Name
			<input
				class="bg-neutral-300 dark:bg-neutral-700"
				placeholder="Catalog name"
				{...name.as('text')}
				value={existingCatalog?.name}
			/>
		</label>

		<label>
			Details
			<textarea
				class="bg-neutral-300 dark:bg-neutral-700"
				placeholder="Catalog details"
				{...desc.as('text')}
				value={existingCatalog?.desc}
			></textarea>
		</label>

		<section>
			<h2>Settings</h2>
			<label class="flex place-items-center">
				<input
					class="max-w-1 me-2"
					{...settings.connections.as('checkbox')}
					checked={existingCatalog?.settings?.connections}
				/>
				Enable Connections
			</label>
		</section>

		<Button
			tabindex="0"
			type="submit"
			class="place-self-end"
			title={existingCatalog ? 'Save Category' : 'Create Category'}
		>
			{existingCatalog ? 'Save' : 'Create'}
		</Button>
	</div>
</form>
