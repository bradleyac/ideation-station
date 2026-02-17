<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { getIdea } from '$lib/remotes/idea.remote';
	import Idea from './Idea.svelte';
	let props = $props();
	let idea = $derived(await getIdea(props.ideaId));

	function hideMenu() {
		props.close();
	}

	async function deleteIdea() {
		if (!idea) return;
		if (confirm(`Really delete "${idea.name}"?`)) {
			await fetch(`/catalogs/${props.catalogId}/ideas/${idea.id}`, {
				method: 'DELETE'
			});
			hideMenu();
			invalidateAll();
		}
	}

	async function linkCategory(categoryId: string) {
		if (!idea) return;
		await fetch(`/catalog/${props.catalogId}/ideas/${idea.id}/categories/${categoryId}`, {
			method: 'PUT'
		});
		hideMenu();
		invalidateAll();
	}

	async function unlinkCategory(categoryId: string) {
		if (!idea) return;
		if (confirm(`Really remove "${idea.name}" from category?`)) {
			await fetch(`/catalogs/${props.catalogId}/ideas/${idea.id}/categories/${categoryId}`, {
				method: 'DELETE'
			});
			hideMenu();
			invalidateAll();
		}
	}

	async function linkIdea(otherIdea: { id: string; related: boolean }) {
		if (!idea) return;
		await fetch(`/catalogs/${props.catalogId}/ideas/${idea.id}/related/${otherIdea?.id}`, {
			method: 'PUT'
		});
		hideMenu();
		invalidateAll();
	}

	async function unlinkIdea(otherIdea: { id: string; related: boolean }) {
		if (!idea) return;
		await fetch(`/catalogs/${props.catalogId}/ideas/${idea.id}/related/${otherIdea?.id}`, {
			method: 'DELETE'
		});
		hideMenu();
		invalidateAll();
	}
</script>

<div
	class="relative shadow-black shadow-sm rounded-sm w-max max-w-full md:max-w-md top-0 left-0 flex-col gap-4 bg-eucalyptus-200 dark:bg-eucalyptus-800 p-4"
>
	{#if props.ideaId}
		<Idea ideaId={props.ideaId} />
		<div class="flex mt-3 w-full justify-end gap-2">
			<Button
				onclick={(e: Event) => {
					e.stopPropagation();
					props.close();
				}}
				tabindex="-1"
				title="Close"><i class="fi fi-rr-cross"></i></Button
			>
			<Button
				class="btn-primary"
				title="Delete Idea"
				onclick={(e: Event) => {
					e.stopPropagation();
					deleteIdea();
				}}
			>
				<i class="fi fi-rr-trash"></i>
			</Button>
			{#if props.categoryId}
				{#if props.idea.categoryIds?.includes(props.categoryId)}
					<Button
						title="Remove From Category"
						onclick={(e: Event) => {
							e.stopPropagation();
							unlinkCategory(props.categoryId);
						}}
					>
						<i class="fi fi-rr-link-slash"></i>
					</Button>
				{:else}
					<Button
						title="Add To Category"
						onclick={(e: Event) => {
							e.stopPropagation();
							linkCategory(props.categoryId);
						}}
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
						onclick={(e: Event) => {
							e.stopPropagation();
							unlinkIdea(props.otherIdea);
						}}
					>
						<i class="fi fi-rr-link-slash"></i>
					</Button>
				{:else}
					<Button
						class="btn-primary"
						title="Link Related Idea"
						onclick={(e: Event) => {
							e.stopPropagation();
							linkIdea(props.otherIdea);
						}}
					>
						<i class="fi fi-rr-link"></i>
					</Button>
				{/if}
			{/if}
		</div>
	{/if}
</div>
