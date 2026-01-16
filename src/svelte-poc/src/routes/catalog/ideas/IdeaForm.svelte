<script lang="ts">
	import { enhance } from '$app/forms';
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

	function removeCategory(i: number) {
		categories.splice(i, 1);
	}
</script>

{#key formKey}
	<form
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
					// TODO: Slight delay between form clear and selecting the right category.
				};
			})}
	>
		<h2>{title}</h2>
		<label>
			Name
			<input required name="name" type="text" placeholder="Idea name" value={existingIdea?.name} />
		</label>

		<label>
			Details
			<textarea required name="desc" placeholder="Idea details">{existingIdea?.desc}</textarea>
		</label>

		<label>
			Categories
			{#each categories as category, i (i)}
				<div style="display:flex">
					<select name="categories[]" required bind:value={categories[i]}>
						<option value="" disabled selected>Select category</option>
						{#each extantCategories as extantCategory}
							<option value={extantCategory.id}>{extantCategory.name}</option>
						{/each}
					</select>
					<button
						class="btn-primary"
						type="button"
						title="Remove Category"
						style:place-self="center"
						style:margin=".25em"
						onclick={() => removeCategory(i)}><i class="fi fi-rr-minus-circle"></i></button
					>
				</div>
			{/each}
		</label>

		<button
			type="button"
			title="Add Category"
			class="btn-primary"
			disabled={categories.at(-1)?.length === 0}
			onclick={() => categories.push('')}><i class="fi fi-rr-add"></i></button
		>

		<datalist id="existing-categories">
			{#each extantCategories as category}
				<option value={category.name}></option>
			{/each}
		</datalist>
		<button
			style:place-self="end"
			type="submit"
			class="btn-primary"
			title={existingIdea ? 'Save Idea' : 'Create Idea'}
		>
			{existingIdea ? 'Save' : 'Create'}
		</button>
	</form>
{/key}

<style>
	form {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		gap: 1em;
		width: 40em;
		background-color: var(--color-primary);
		border-radius: 0.5em;
		padding: 1em;
		box-shadow: 0 0 1px black;

		label > * {
			margin-top: 0.25em;
		}

		h2 {
			margin: 0;
		}
	}
</style>
