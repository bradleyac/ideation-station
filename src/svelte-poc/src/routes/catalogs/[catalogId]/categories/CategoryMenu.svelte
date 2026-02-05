<script lang="ts">
	import { getCategory } from '$lib/remotes/category.remote';

	let props: { categoryId: string } = $props();
</script>

<div
	class="relative shadow-black shadow-sm rounded-sm w-max max-w-full md:max-w-md top-0 left-0 flex flex-col gap-4 bg-eucalyptus-200 dark:bg-eucalyptus-800 p-4"
>
	{#await getCategory(props.categoryId)}
		Loading...
	{:then category}
		{#if category}
			<h1>{category.name}</h1>
			<pre>{category.desc}</pre>
		{:else}
			Category not found.
		{/if}
	{/await}
</div>
