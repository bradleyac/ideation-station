<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import type { Category, Idea } from '$lib/types.js';
	import type { ActionResult } from '@sveltejs/kit';
	let props = $props();
	const {
		catalogId,
		extantCategories,
		existingIdea,
		defaultCategoryId,
		enhanceCallback
	}: {
		catalogId: string;
		extantCategories: Category[];
		existingIdea?: Idea;
		defaultCategoryId?: string;
		enhanceCallback?: () => ({
			update,
			result
		}: {
			update: () => Promise<void>;
			result: ActionResult;
		}) => Promise<void>;
	} = props;
	let title = $derived(props.existingIdea ? 'Edit Idea' : 'Create New Idea');
	let action = $derived(
		props.existingIdea
			? `/catalogs/${props.catalogId}/ideas/${props.existingIdea.id}`
			: `/catalogs/${props.catalogId}/ideas`
	);
	let category = $derived(props.existingIdea?.categoryId || props.defaultCategoryId || undefined);

	let formKey = $state(0);
	let sortedExtantCategories = $derived(
		extantCategories.toSorted((a, b) => (a.name < b.name ? -1 : 1))
	);
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
						category = defaultCategoryId ? [defaultCategoryId] : [];
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
					placeholder="Idea name"
					value={existingIdea?.name}
				/>
			</label>

			<label>
				Details
				<textarea
					class="bg-neutral-300 dark:bg-neutral-700"
					required
					name="desc"
					placeholder="Idea details">{existingIdea?.desc}</textarea
				>
			</label>

			<label>
				Category
				<div class="flex flex-col gap-2">
					<div class="flex w-full gap-2">
						<select
							class="w-full bg-neutral-300 dark:bg-neutral-700 rounded-sm"
							name="category"
							required
							bind:value={category}
						>
							<option value="" disabled selected>Select category</option>
							{#each sortedExtantCategories as extantCategory}
								<option value={extantCategory.id}>{extantCategory.name}</option>
							{/each}
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
{/key}
