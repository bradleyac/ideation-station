<script lang="ts">
	import { computePosition, offset } from '@floating-ui/dom';
	import { onMount } from 'svelte';
	import { on } from 'svelte/events';

	const { target = $bindable() }: { target?: HTMLElement } = $props();

	const offsetPx = 0;

	let scrollState = $state({
		height: 0,
		scrollHeight: 0,
		scrollTop: 0
	});

	let atTop = $derived(
		scrollState.height === scrollState.scrollHeight || scrollState.scrollTop <= 20
	);

	let atBottom = $derived(
		scrollState.height === scrollState.scrollHeight ||
			scrollState.scrollTop + scrollState.height >= scrollState.scrollHeight - 20
	);

	let topArrow = $state<HTMLDivElement>();
	let topArrowTopPx = $state(0);
	let topArrowLeftPx = $state(0);

	let bottomArrow = $state<HTMLDivElement>();
	let bottomArrowTopPx = $state(0);
	let bottomArrowLeftPx = $state(0);

	function update() {
		if (!topArrow || !bottomArrow || !target) return;

		computePosition(target, topArrow, {
			placement: 'top',
			middleware: [offset(offsetPx)]
		}).then(({ x, y }) => {
			topArrowLeftPx = x;
			topArrowTopPx = y;
		});

		computePosition(target, bottomArrow, {
			placement: 'bottom',
			middleware: [offset(offsetPx)]
		}).then(({ x, y }) => {
			bottomArrowLeftPx = x;
			bottomArrowTopPx = y;
		});
	}

	function onScroll() {
		if (target) {
			scrollState = {
				height: target.clientHeight,
				scrollHeight: target.scrollHeight,
				scrollTop: target.scrollTop
			};
			update();
		}
	}

	onMount(() => {
		if (target) {
			return on(target, 'scroll', onScroll);
		}
	});

	onMount(() => {
		if (window) {
			return on(window, 'resize', onScroll);
		}
	});

	onMount(onScroll);
</script>

<div
	bind:this={topArrow}
	aria-hidden={true}
	style:top="{topArrowTopPx}px"
	style:left="{topArrowLeftPx}px"
	class={[atTop && 'hidden', 'absolute z-15 flex']}
>
	{#if !atTop}
		<i class={['fi fi-sr-triangle opacity-20 text-xs']}></i>
	{/if}
</div>

<div
	bind:this={bottomArrow}
	aria-hidden={true}
	style:top="{bottomArrowTopPx}px"
	style:left="{bottomArrowLeftPx}px"
	class={[atBottom && 'hidden', 'absolute z-15 flex']}
>
	{#if !atBottom}
		<i class={['fi fi-sr-triangle opacity-20 text-xs transform-[rotate(180deg)]']}></i>
	{/if}
</div>
