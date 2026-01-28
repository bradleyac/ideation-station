<script lang="ts">
	let { ref = $bindable<HTMLElement>(), ...props } = $props();

	let show = $state(true);

	function hideMenu() {
		show = false;
	}
</script>

<div
	bind:this={ref}
	class={[
		'relative shadow-black shadow-sm rounded-sm w-max max-w-full md:max-w-md top-0 left-0 flex-col gap-4 bg-eucalyptus-200 dark:bg-eucalyptus-800 p-4',
		show ? 'flex' : 'hidden'
	]}
>
	{#if props.category}
		<h1>{props.category.name}</h1>
		<pre>{props.category.desc}</pre>
	{/if}
</div>
