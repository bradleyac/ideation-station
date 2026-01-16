<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import { tooltip } from '$lib/attachments/tippy.svelte';
	import type { Idea } from '$lib/types.js';
	const {
		idea,
		categoryId,
		otherIdea
	}: { idea: Idea; categoryId?: string; otherIdea?: { id: string; related: boolean } } = $props();

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

<div bind:this={menu} class="idea-preview__menu">
	<pre>{idea.desc}</pre>
	<div class="idea-preview-buttons__container">
		<button class="btn-primary" title="Delete Idea" onclick={() => deleteIdea(idea)}>
			<i class="fi fi-rr-trash"></i>
		</button>
		{#if categoryId}
			{#if idea.categoryIds?.includes(categoryId)}
				<button class="btn-primary" title="Remove From Category" onclick={unlinkCategory}>
					<i class="fi fi-rr-link-slash"></i>
				</button>
			{:else}
				<button class="btn-primary" title="Add To Category" onclick={linkCategory}>
					<i class="fi fi-rr-link"></i>
				</button>
			{/if}
		{/if}
		{#if otherIdea}
			{#if otherIdea.related}
				<button class="btn-primary" title="Unlink Related Idea" onclick={unlinkIdea}>
					<i class="fi fi-rr-link-slash"></i>
				</button>
			{:else}
				<button class="btn-primary" title="Link Related Idea" onclick={linkIdea}>
					<i class="fi fi-rr-link"></i>
				</button>
			{/if}
		{/if}
	</div>
</div>

<div class="idea-preview__container">
	<a href="/catalog/ideas/{idea.id}" {@attach tooltip({ content: menu, interactive: true })}>
		{idea.name}
	</a>
</div>

<style>
	:global(.tippy-box) .idea-preview__menu {
		display: flex;
	}
	.idea-preview__menu {
		display: none;
		flex-direction: column;
		gap: 0.5em;
		width: 15em;
	}
	.idea-preview-buttons__container {
		background-color: var(--color-primary-contrast);
		display: flex;
		flex-direction: row;
		gap: 0.5em;
		width: 100%;
		justify-content: end;

		button {
			box-shadow: 0 0 1px black;
		}
	}

	.idea-preview__container {
		display: flex;
		flex-direction: row;
		border-radius: 1em;
		box-shadow: 0 0 1px black;
		background-color: var(--bg-color);
		position: relative;
		gap: 0.5em;

		&:hover {
			background-color: oklch(from var(--bg-color) calc(l + 0.1) c h);
		}

		a {
			text-decoration: none;
			color: inherit;
			margin: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			text-wrap: nowrap;
			padding: 0.5em;
		}
	}
</style>
