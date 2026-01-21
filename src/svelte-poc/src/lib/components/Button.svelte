<script lang="ts">
	const props = $props();
	// TODO: Better way to customize colors?
	const colorScheme = $derived(props.colorScheme ?? 'eucalyptus');
</script>

<button
	{...props}
	class={[
		'p-2',
		'rounded-sm',
		'w-max',
		'place-items-center',
		'gap-2',
		'flex',
		'flex-row',
		'place-content-center',
		props.disabled && 'opacity-50',
		colorScheme === 'eucalyptus' && 'bg-eucalyptus-400 dark:bg-eucalyptus-600',
		props.disabled ||
			(colorScheme === 'eucalyptus' &&
				'hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800'),
		props.class
	]}
>
	{@render props.children?.()}
</button>
