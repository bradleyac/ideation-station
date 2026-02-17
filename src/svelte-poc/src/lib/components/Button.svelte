<script lang="ts">
	import type { Snippet } from 'svelte';

	type RoundOptions = 'all' | 'start' | 'end' | 'none';
	let {
		rounded = 'all',
		buttonRef = $bindable(),
		...props
	}: {
		rounded?: RoundOptions;
		buttonRef?: HTMLButtonElement;
		colorScheme?: 'eucalyptus';
		disabled?: boolean;
		class?: string | string[];
		lit?: boolean;
		children: Snippet;
		[key: string]: any;
	} = $props();
	const roundedClass = $derived(
		rounded === 'all'
			? 'rounded-sm'
			: rounded === 'start'
				? 'rounded-s-sm'
				: rounded === 'end'
					? 'rounded-e-sm'
					: ''
	);
	// TODO: Better way to customize colors?
	const colorScheme = $derived(props.colorScheme ?? 'eucalyptus');
</script>

<button
	bind:this={buttonRef}
	{...props}
	class={[
		roundedClass,
		'w-max',
		'h-full',
		'flex',
		props.disabled && 'opacity-50',
		colorScheme === 'eucalyptus' && 'bg-eucalyptus-400 dark:bg-eucalyptus-600',
		props.disabled ||
			(colorScheme === 'eucalyptus' &&
				'hover:bg-eucalyptus-300 active:bg-eucalyptus-500 dark:hover:bg-eucalyptus-700 dark:active:bg-eucalyptus-800'),
		props.lit && 'ring z-1',
		props.class
	]}
>
	<div class="flex flex-row place-content-center place-items-center gap-2 p-2 w-full h-[44px]">
		{@render props.children?.()}
	</div>
</button>
