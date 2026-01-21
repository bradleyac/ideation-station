<script lang="ts">
	import type { Category } from '$lib/types';

	const { category }: { category: Category } = $props();
</script>

<a
	tabindex="0"
	class="grid grid-cols-[auto_min-content] grid-flow-col shadow-amber-500/30 shadow-sm bg-eucalyptus-400 hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:bg-eucalyptus-600 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800 py-3 px-4 rounded-sm"
	href="/catalog/categories/{category.id}"
>
	<span>
		{category.name}
	</span>
	<div class="-my-3 mx-3 border-e"></div>
	<span>
		{category.count ?? 0}
	</span>
</a>
