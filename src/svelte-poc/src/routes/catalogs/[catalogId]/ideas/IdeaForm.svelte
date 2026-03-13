<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getAllCategoryMetadata } from '$lib/remotes/category.remote';
	import { getIdea, upsertIdea } from '$lib/remotes/idea.remote';

	const props: {
		catalogId: string;
		existingIdeaId?: string;
		defaultCategoryId?: string;
		enhanceCallback?: Parameters<typeof upsertIdea.enhance>[0];
	} = $props();

	let title = $derived(props.existingIdeaId ? 'Edit Idea' : 'Create New Idea');

	let existingIdeaPromise = $derived(
		props?.existingIdeaId ? getIdea(props?.existingIdeaId) : undefined
	);
	let categoryMetadataPromise = $derived(getAllCategoryMetadata(props.catalogId));
	let existingIdea = $derived(await existingIdeaPromise);
	let categoryMetadata = $derived(await categoryMetadataPromise);
	let categoryId = $derived(
		props.existingIdeaId
			? (await existingIdeaPromise)?.categoryId
			: props.defaultCategoryId || undefined
	);

	const { id, name, desc, img, categoryId: categoryField, catalogId } = upsertIdea.fields;
</script>

<form
	class="flex flex-col overflow-clip min-[32rem]:rounded-sm w-full max-w-lg"
	{...upsertIdea.enhance(props.enhanceCallback ?? (async (opts) => await opts.submit()))}
	enctype="multipart/form-data"
>
	<h2 class="bg-eucalyptus-300 dark:bg-eucalyptus-700 p-3">{title}</h2>
	<div class="bg-neutral-200 dark:bg-neutral-800 p-3 gap-4 flex flex-col">
		<input hidden {...catalogId.as('text')} value={props.catalogId} />
		<input hidden {...id.as('text')} value={props.existingIdeaId} />
		<label>
			Name
			<input
				class="bg-neutral-300 dark:bg-neutral-700"
				required
				{...name.as('text')}
				placeholder="Idea name"
				value={existingIdea?.name}
			/>
		</label>

		<label>
			Details
			<textarea
				class="bg-neutral-300 dark:bg-neutral-700"
				required
				{...desc.as('text')}
				placeholder="Idea details">{existingIdea?.desc}</textarea
			>
		</label>

		<label>
			Image
			<input {...img.as('file')} />
		</label>

		<label>
			Category
			<div class="flex flex-col gap-2">
				<div class="flex w-full gap-2">
					<select
						class="w-full bg-neutral-300 dark:bg-neutral-700 rounded-sm"
						required
						bind:value={categoryId}
						{...categoryField.as('select')}
					>
						<option value="" label="Select Category" selected disabled>Select category</option>
						{#if categoryMetadata}
							{#each categoryMetadata as extantCategory}
								<option value={extantCategory.id}>{extantCategory.name}</option>
							{/each}
						{/if}
					</select>
				</div>
			</div>
		</label>

		<Button
			tabindex="0"
			type="submit"
			class="place-self-end"
			title={existingIdea ? 'Save Idea' : 'Create Idea'}
		>
			{existingIdea ? 'Save' : 'Create'}
		</Button>
	</div>
</form>
