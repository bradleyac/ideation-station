<script lang="ts">
	import type { Idea } from '$lib/types.js';
	import { on } from 'svelte/events';
	const {
		idea,
		mode = 'default'
	}: {
		idea: Idea;
		mode?: 'default' | 'compact';
	} = $props();

	function attachTouchFocus(node: HTMLElement) {
		return on(
			node,
			'touchend',
			(e) => {
				if (e.touches.length >= 1) return;
				let el = e.target as HTMLElement;
				if (el !== document.activeElement) {
					e.preventDefault();
					el.focus();
				}
			},
			{ passive: false }
		);
	}
</script>

{#if mode === 'default'}
	<a
		class="inline-block rounded-sm shadow-amber-500/30 shadow-sm px-4 py-3 bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800"
		tabindex="0"
		href="/catalog/ideas/{idea.id}"
		data-ideaid={idea.id}
		{@attach attachTouchFocus}
	>
		{idea.name}
	</a>
{:else if mode === 'compact'}
	<a
		class="inline-block p-1 w-full bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800"
		href="/catalog/ideas/{idea.id}"
		data-ideaid={idea.id}
		{@attach attachTouchFocus}
	>
		{idea.name}
	</a>
{/if}
