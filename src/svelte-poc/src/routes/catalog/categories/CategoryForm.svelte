<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import type { CategoryFull } from '$lib/types.js';
	import type { ActionResult } from '@sveltejs/kit';
	let props = $props();
	const {
		existingCategory,
		enhanceCallback
	}: {
		existingCategory?: CategoryFull;
		enhanceCallback?: () => ({
			update,
			result
		}: {
			update: () => Promise<void>;
			result: ActionResult;
		}) => Promise<void>;
	} = props;
	let title = $derived(props.existingCategory ? 'Edit Category' : 'Create New Category');
	let action = $derived(
		props.existingCategory
			? `/catalog/categories/${props.existingCategory.id}`
			: '/catalog/categories'
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
					placeholder="Category name"
					value={existingCategory?.name}
				/>
			</label>

			<label>
				Details
				<textarea
					class="bg-neutral-300 dark:bg-neutral-700"
					required
					name="desc"
					placeholder="Category details">{existingCategory?.desc}</textarea
				>
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
{/key}
