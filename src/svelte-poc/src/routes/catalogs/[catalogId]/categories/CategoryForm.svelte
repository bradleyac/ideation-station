<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getCategory, upsertCategory } from '$lib/remotes/category.remote';
	const props: {
		catalogId: string;
		existingCategoryId?: string;
		enhanceCallback?: Parameters<typeof upsertCategory.enhance>[0];
	} = $props();
	let title = $derived(props.existingCategoryId ? 'Edit Category' : 'Create New Category');

	let existingCategory = $derived(
		props.existingCategoryId ? await getCategory(props.existingCategoryId) : undefined
	);

	const { id, name, desc, catalogId } = upsertCategory.fields;
</script>

<form
	class="flex flex-col overflow-clip min-[32rem]:rounded-sm w-full max-w-lg"
	{...upsertCategory.enhance(props.enhanceCallback ?? (async (opts) => await opts.submit()))}
>
	<input hidden {...id.as('text')} value={props.existingCategoryId} />
	<input hidden {...catalogId.as('text')} value={props.catalogId} />
	<h2 class="bg-eucalyptus-300 dark:bg-eucalyptus-700 p-3">{title}</h2>
	<div class="bg-neutral-200 dark:bg-neutral-800 p-3 gap-4 flex flex-col">
		<label>
			Name
			<input
				class="bg-neutral-300 dark:bg-neutral-700"
				{...name.as('text')}
				placeholder="Category name"
				value={existingCategory?.name}
			/>
		</label>

		<label>
			Details
			<textarea
				class="bg-neutral-300 dark:bg-neutral-700"
				{...desc.as('text')}
				placeholder="Category details"
				value={existingCategory?.desc}
			></textarea>
		</label>

		<Button
			tabindex="0"
			type="submit"
			class="place-self-end"
			title={existingCategory ? 'Save Category' : 'Create Category'}
		>
			{existingCategory ? 'Save' : 'Create'}
		</Button>
	</div>
</form>
