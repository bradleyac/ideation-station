<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import { computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { trapFocus } from '@zag-js/focus-trap';
	import { on } from 'svelte/events';

	const props: {
		title: string;
		children?: Snippet;
		menu?: Snippet<[() => void]>;
		class: string | string[];
	} = $props();
	let visible = $state(false);
	let button = $state<HTMLButtonElement>();
	let popover = $state<HTMLDivElement>();
	let topPx = $state(0);
	let leftPx = $state(0);

	function togglePopover(e: Event) {
		// Blur the button so that it doesn't prevent autofocus
		(e.currentTarget as HTMLElement)?.blur();
		if (visible) {
			visible = false;
		} else {
			visible = true;
			update();
		}
	}

	function closePopover() {
		visible = false;
	}

	function update() {
		if (!popover || !button) return;
		computePosition(button, popover, {
			placement: 'top-start',
			middleware: [offset(10), flip(), shift()]
		}).then(({ x, y }) => {
			leftPx = x;
			topPx = y;
		});
	}

	$effect(() => {
		if (visible && popover) {
			return trapFocus(popover);
		}
	});

	$effect(() => {
		return on(document, 'keydown', (e) => {
			if (e.key === 'Escape') {
				closePopover();
			}
		});
	});
</script>

<Button {...props} bind:buttonRef={button} title={props.title} onclick={togglePopover}>
	{@render props.children?.()}
</Button>

<div
	bind:this={popover}
	style:top="{topPx}px"
	style:left="{leftPx}px"
	class={[visible || 'hidden', 'absolute z-5 max-w-full flex']}
>
	{#if visible}
		{@render props.menu?.(closePopover)}
	{/if}
</div>
