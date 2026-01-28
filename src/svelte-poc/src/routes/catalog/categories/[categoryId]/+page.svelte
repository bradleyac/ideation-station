<script lang="ts">
	import type { Idea } from '$lib/types.js';
	import IdeaPreview from '../../ideas/IdeaPreview.svelte';
	import IdeaForm from '../../ideas/IdeaForm.svelte';
	import TextTicker from '$lib/components/TextTicker.svelte';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import IdeaList from '../../ideas/IdeaList.svelte';

	const { data, params } = $props();

	const relatedIdeas: Idea[] = $derived(
		data.ideas.filter((idea) => data.ideaIds.includes(idea.id))
	);

	async function deleteCategory() {
		if (confirm(`Really delete "${data.category.name}"?`)) {
			await fetch(`/catalog/categories/${data.category.id}`, {
				method: 'DELETE'
			});
			await goto('/catalog');
			await invalidateAll();
		}
	}

	let showModal = $state(false);
	let ideaKey = $state(0);
</script>

<svelte:head><title>{data.title}</title></svelte:head>

<Modal bind:showModal>
	{#key ideaKey}
		<IdeaForm
			extantCategories={data.categories}
			defaultCategoryId={params.categoryId === 'Uncategorized' ? undefined : params.categoryId}
		/>
	{/key}
</Modal>

{#key params.categoryId}
	<div class="fixed z-2 top-2.5 right-4 invisible lg:visible">
		<TextTicker labels={relatedIdeas.map((idea) => idea.name)} period={5000} />
	</div>

	<section class="flex flex-col gap-4 m-3">
		<h1>{data.category.name}</h1>
		<pre>{data.category.desc}</pre>
		<div class="flex gap-2">
			<Button
				class="flex place-items-center w-max p-2"
				onclick={() => {
					showModal = !showModal;
					ideaKey++;
				}}
				title="Open Create Idea Form"><i class="block fi fi-rr-add"></i>New Idea</Button
			>

			{#if params.categoryId !== 'Uncategorized'}
				<Button
					class="flex place-items-center w-max p-2"
					onclick={deleteCategory}
					title="Delete Category"><i class="fi fi-rr-trash"></i>Delete Category</Button
				>
			{/if}
		</div>

		<IdeaList title="Contained Ideas" ideas={relatedIdeas} categoryId={data.category.id} />
	</section>
{/key}
