<script lang="ts">
	let props = $props();
</script>

<div
	class="relative shadow-black shadow-sm rounded-sm w-max max-w-full md:max-w-md top-0 left-0 flex flex-col gap-4 bg-eucalyptus-200 dark:bg-eucalyptus-800 p-4"
>
	{#if props.category}
		<h1>{props.category.name}</h1>
		<pre>{props.category.desc}</pre>
	{/if}
</div>
