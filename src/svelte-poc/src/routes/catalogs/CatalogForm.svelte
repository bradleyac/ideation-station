<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import type { Catalog } from '$lib/types.js';
	import type { ActionResult } from '@sveltejs/kit';
	const {
		enhanceCallback,
		...props
	}: {
		existingCatalog?: Catalog;
		enhanceCallback?: () => ({
			update,
			result
		}: {
			update: () => Promise<void>;
			result: ActionResult;
		}) => Promise<void>;
	} = $props();
	let title = $derived(props.existingCatalog ? 'Edit Catalog' : 'Create New Catalog');
	let action = $derived(
		props.existingCatalog ? `/catalogs/${props.existingCatalog?.id}?/updateCatalog` : `/catalogs`
	);

	let formKey = $state(0);
</script>

{#key formKey}
	<form
		class="flex flex-col overflow-clip min-[32rem]:rounded-sm w-full max-w-lg"
		method="POST"
		{action}
		use:enhance={enhanceCallback ??
			(() => {
				return async ({ update, result }) => {
					if (result?.type === 'success') {
						formKey += 1;
					}
					await update({ reset: false });
				};
			})}
	>
		<h2 class="bg-eucalyptus-300 dark:bg-eucalyptus-700 p-3">{title}</h2>
		<div class="bg-neutral-200 dark:bg-neutral-800 p-3 gap-4 flex flex-col">
			<label>
				Name
				<input
					class="bg-neutral-300 dark:bg-neutral-700"
					required
					name="name"
					type="text"
					placeholder="Catalog name"
					value={props.existingCatalog?.name}
				/>
			</label>

			<label>
				Details
				<textarea
					class="bg-neutral-300 dark:bg-neutral-700"
					required
					name="desc"
					placeholder="Catalog details">{props.existingCatalog?.desc}</textarea
				>
			</label>

			<Button
				tabindex="0"
				type="submit"
				class="place-self-end"
				title={props.existingCatalog ? 'Save Category' : 'Create Category'}
			>
				{props.existingCatalog ? 'Save' : 'Create'}
			</Button>
		</div>
	</form>
{/key}
