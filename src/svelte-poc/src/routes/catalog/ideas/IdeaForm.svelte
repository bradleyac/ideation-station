<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import type { Category, Idea } from '$lib/types.js';
	import type { ActionResult } from '@sveltejs/kit';
	let props = $props();
	const {
		extantCategories,
		existingIdea,
		defaultCategoryId,
		enhanceCallback
	}: {
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
		props.existingIdea ? `/catalog/ideas/${props.existingIdea.id}` : '/catalog/ideas'
	);
	let categories: string[] = $state([
		...(props.existingIdea?.categoryIds ||
			(props.defaultCategoryId ? [props.defaultCategoryId] : []))
	]);

	let formKey = $state(0);
	let sortedExtantCategories = $derived(
		extantCategories.toSorted((a, b) => (a.name < b.name ? -1 : 1))
	);

	function removeCategory(i: number) {
		categories.splice(i, 1);
	}
</script>

{#key formKey}
	<form
		class="flex flex-col overflow-clip lg:rounded-sm w-full max-w-lg"
		method="POST"
		{action}
		use:enhance={enhanceCallback ??
			(() => {
				return async ({ update, result }) => {
					if (result?.type === 'success') {
						categories = defaultCategoryId ? [defaultCategoryId] : [];
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
				Categories
				<div class="flex flex-col gap-2">
					{#each categories as category, i (i)}
						<div class="flex w-full gap-2">
							<select
								class="w-full bg-neutral-300 dark:bg-neutral-700 rounded-sm"
								name="categories[]"
								required
								bind:value={categories[i]}
							>
								<option value="" disabled selected>Select category</option>
								{#each sortedExtantCategories as extantCategory}
									<option value={extantCategory.id}>{extantCategory.name}</option>
								{/each}
							</select>
							<Button
								type="button"
								class="btn-primary"
								title="Remove Category"
								onclick={() => removeCategory(i)}><i class="fi fi-rr-minus-circle"></i></Button
							>
						</div>
					{/each}
				</div>
			</label>

			<Button
				type="button"
				title="Add Category"
				class="place-self-start"
				disabled={categories.at(-1)?.length === 0}
				onclick={() => categories.push('')}><i class="fi fi-rr-add"></i></Button
			>

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
