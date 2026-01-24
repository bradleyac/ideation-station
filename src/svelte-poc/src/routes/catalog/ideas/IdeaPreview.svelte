<script lang="ts">
	import type { Idea } from '$lib/types.js';
	const {
		idea,
		mode = 'default'
	}: {
		idea: Idea;
		mode?: 'default' | 'compact';
	} = $props();

	function ontouchend(e: TouchEvent) {
		if (e.touches.length > 0) return;
		let el = e.target as HTMLElement;
		if (el !== document.activeElement) {
			e.preventDefault();
			el.focus();
		}
	}
</script>

{#if mode === 'default'}
	<a
		class="inline-block rounded-sm shadow-amber-500/30 shadow-sm px-4 py-3 bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800"
		tabindex="0"
		href="/catalog/ideas/{idea.id}"
		data-ideaid={idea.id}
		{ontouchend}
	>
		{idea.name}
	</a>
{:else if mode === 'compact'}
	<a
		class="inline-block p-1 w-full bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800"
		href="/catalog/ideas/{idea.id}"
		data-ideaid={idea.id}
		{ontouchend}
	>
		{idea.name}
	</a>
{/if}
