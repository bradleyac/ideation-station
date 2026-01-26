<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Idea from './Idea.svelte';
	import { type Idea as IdeaT } from '$lib/types';
	import { invalidateAll } from '$app/navigation';
	let { ref = $bindable<HTMLElement>(), ...props } = $props();

	function hideMenu() {
		if (ref) {
			ref.style.display = '';
		}
	}

	async function deleteIdea(idea: IdeaT) {
		if (confirm(`Really delete "${idea.name}"?`)) {
			await fetch(`/catalog/ideas/${idea.id}`, {
				method: 'DELETE'
			});
			hideMenu();
			invalidateAll();
		}
	}

	async function linkCategory(idea: IdeaT, categoryId: string) {
		await fetch(`/catalog/ideas/${idea.id}/categories/${categoryId}`, {
			method: 'PUT'
		});
		hideMenu();
		invalidateAll();
	}

	async function unlinkCategory(idea: IdeaT, categoryId: string) {
		if (confirm(`Really remove "${idea.name}" from category?`)) {
			await fetch(`/catalog/ideas/${idea.id}/categories/${categoryId}`, {
				method: 'DELETE'
			});
			hideMenu();
			invalidateAll();
		}
	}

	async function linkIdea(idea: IdeaT, otherIdea: { id: string; related: boolean }) {
		await fetch(`/catalog/ideas/${idea.id}/related/${otherIdea?.id}`, {
			method: 'PUT'
		});
		hideMenu();
		invalidateAll();
	}

	async function unlinkIdea(idea: IdeaT, otherIdea: { id: string; related: boolean }) {
		await fetch(`/catalog/ideas/${idea.id}/related/${otherIdea?.id}`, {
			method: 'DELETE'
		});
		hideMenu();
		invalidateAll();
	}
</script>

<div
	bind:this={ref}
	class="absolute z-2 shadow-black shadow-sm rounded-sm w-max max-w-full md:max-w-md top-0 left-0 hidden flex-col gap-4 bg-eucalyptus-200 dark:bg-eucalyptus-800 p-4"
>
	{#if props.idea}
		<Idea idea={props.idea} />
		<div class="flex mt-3 w-full justify-end idea-preview-Buttons__container gap-2">
			<Button class="btn-primary" title="Delete Idea" onclick={() => deleteIdea(props.idea)}>
				<i class="fi fi-rr-trash"></i>
			</Button>
			{#if props.categoryId}
				{#if props.idea.categoryIds?.includes(props.categoryId)}
					<Button
						title="Remove From Category"
						onclick={() => unlinkCategory(props.idea, props.categoryId)}
					>
						<i class="fi fi-rr-link-slash"></i>
					</Button>
				{:else}
					<Button
						title="Add To Category"
						onclick={() => linkCategory(props.idea, props.categoryId)}
					>
						<i class="fi fi-rr-link"></i>
					</Button>
				{/if}
			{/if}
			{#if props.otherIdea}
				{#if props.otherIdea.related}
					<Button
						class="btn-primary"
						title="Unlink Related Idea"
						onclick={() => unlinkIdea(props.idea, props.otherIdea)}
					>
						<i class="fi fi-rr-link-slash"></i>
					</Button>
				{:else}
					<Button
						class="btn-primary"
						title="Link Related Idea"
						onclick={() => linkIdea(props.idea, props.otherIdea)}
					>
						<i class="fi fi-rr-link"></i>
					</Button>
				{/if}
			{/if}
		</div>
	{/if}
</div>
