<script lang="ts">
	import type { Category } from '$lib/types';

	const {
		category,
		mode = 'default'
	}: {
		category: Category;
		mode?: 'default' | 'compact';
	} = $props();
</script>

{#if mode === 'default'}
	<a
		tabindex="0"
		class="grid grid-cols-[auto_min-content] grid-flow-col shadow-amber-500/30 shadow-sm bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800 py-3 px-4 rounded-sm"
		href="/catalog/categories/{category.id}"
		data-id={category.id}
	>
		<span inert>
			{category.name}
		</span>
		<div inert class="-my-3 mx-4 border-e"></div>
		<span inert>
			{category.count ?? 0}
		</span>
	</a>
{:else if mode === 'compact'}
	<a
		tabindex="0"
		class="grid grid-cols-[auto_min-content] grid-flow-col shadow-amber-500/30 shadow-sm bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800 py-3 px-4 rounded-sm"
		href="/catalog/categories/{category.id}"
		data-id={category.id}
	>
		<span inert>
			{category.name}
		</span>
		<div inert class="-my-3 mx-4 border-e"></div>
		<span inert>
			{category.count ?? 0}
		</span>
	</a>
{/if}
