<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import { tooltip } from '$lib/attachments/tippy.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { Idea } from '$lib/types.js';
	const {
		idea,
		categoryId,
		otherIdea,
		mode = 'default'
	}: {
		idea: Idea;
		categoryId?: string;
		otherIdea?: { id: string; related: boolean };
		mode?: 'default' | 'compact';
	} = $props();

	let menu = $state<HTMLElement | null>(null);

	async function deleteIdea(idea: Idea) {
		if (confirm(`Really delete "${idea.name}"?`)) {
			await fetch(`/catalog/ideas/${idea.id}`, {
				method: 'DELETE'
			});
			invalidateAll();
		}
	}

	async function linkCategory() {
		await fetch(`/catalog/ideas/${idea.id}/categories/${categoryId}`, {
			method: 'PUT'
		});
		invalidateAll();
	}

	async function unlinkCategory() {
		if (confirm(`Really remove "${idea.name}" from category?`)) {
			await fetch(`/catalog/ideas/${idea.id}/categories/${categoryId}`, {
				method: 'DELETE'
			});
			invalidateAll();
		}
	}

	async function linkIdea() {
		await fetch(`/catalog/ideas/${idea.id}/related/${otherIdea?.id}`, {
			method: 'PUT'
		});
		invalidateAll();
	}

	async function unlinkIdea() {
		await fetch(`/catalog/ideas/${idea.id}/related/${otherIdea?.id}`, {
			method: 'DELETE'
		});
		invalidateAll();
	}
</script>

<div
	bind:this={menu}
	class="idea-preview__menu hidden flex-col gap-4 bg-eucalyptus-200 dark:bg-eucalyptus-800 p-4"
>
	<pre>{idea.desc}</pre>
	<div class="flex w-full justify-end idea-preview-Buttons__container gap-2">
		<Button class="btn-primary" title="Delete Idea" onclick={() => deleteIdea(idea)}>
			<i class="fi fi-rr-trash"></i>
		</Button>
		{#if categoryId}
			{#if idea.categoryIds?.includes(categoryId)}
				<Button title="Remove From Category" onclick={unlinkCategory}>
					<i class="fi fi-rr-link-slash"></i>
				</Button>
			{:else}
				<Button title="Add To Category" onclick={linkCategory}>
					<i class="fi fi-rr-link"></i>
				</Button>
			{/if}
		{/if}
		{#if otherIdea}
			{#if otherIdea.related}
				<Button class="btn-primary" title="Unlink Related Idea" onclick={unlinkIdea}>
					<i class="fi fi-rr-link-slash"></i>
				</Button>
			{:else}
				<Button class="btn-primary" title="Link Related Idea" onclick={linkIdea}>
					<i class="fi fi-rr-link"></i>
				</Button>
			{/if}
		{/if}
	</div>
</div>

{#if mode === 'default'}
	<a
		class="inline-block rounded-sm shadow-amber-500/30 shadow-sm px-4 py-3 bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800"
		tabindex="0"
		href="/catalog/ideas/{idea.id}"
		{@attach tooltip({ content: menu, interactive: true })}
	>
		{idea.name}
	</a>
{:else if mode === 'compact'}
	<a
		class="inline-block p-1 w-full bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800"
		href="/catalog/ideas/{idea.id}"
		{@attach tooltip({ content: menu, interactive: true })}
	>
		{idea.name}
	</a>
{/if}

<style>
	/* Not replacing with tailwind */
	:global(.tippy-box) .idea-preview__menu {
		display: flex;
	}
</style>
