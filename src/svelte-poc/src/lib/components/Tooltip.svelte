<script lang="ts">
	import { computePosition, flip, shift } from '@floating-ui/dom';
	import type { Snippet } from 'svelte';
	import { on } from 'svelte/events';
	let { children, parent }: { children: Snippet<[string]>; parent: HTMLElement } = $props();
	let visible = $state(false);
	let tip = $state<HTMLDivElement>();
	let leftPx = $state(0);
	let topPx = $state(0);
	let currentId = $state('');

	const debounceTime = 300;

	let timeoutId: NodeJS.Timeout;

	function getId(target: any): string | undefined {
		return (target as HTMLElement).dataset?.['id'];
	}

	$effect(() => {
		return on(document, 'keydown', (e) => e.key === 'Escape' && hideNow());
	});

	$effect(() => {
		if (!tip) return;
		const offs = [
			on(tip, 'mouseleave', hideTooltip),
			on(tip, 'mouseenter', showTooltip),
			on(tip, 'touchend', delayShowTooltip) // This one delayed because focusout on the target happens right after and would close it
		];
		return () => {
			offs.forEach((off) => off());
		};
	});

	$effect(() => {
		if (!parent) return;
		const offs = [
			on(parent, 'mouseover', maybeShow),
			on(parent, 'mouseout', maybeHide),
			on(parent, 'focusin', maybeShow),
			on(parent, 'focusout', maybeHide),
			on(parent, 'touchend', maybeFocusAndPreventDefault)
		];
		return () => {
			offs.forEach((off) => off());
		};
	});

	function maybeFocusAndPreventDefault(evt: TouchEvent) {
		const anchor = evt.target as HTMLAnchorElement;
		if (!!anchor?.href && anchor !== document.activeElement) {
			evt.preventDefault();
			anchor.focus();
		}
	}

	function update(target: HTMLElement) {
		if (!tip) return;
		computePosition(target, tip, {
			placement: 'top',
			middleware: [flip(), shift()]
		}).then(({ x, y }) => {
			leftPx = x;
			topPx = y;
		});
	}

	function maybeShow(evt: Event) {
		const id = getId(evt.target);
		if (id) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				currentId = id;
				update(evt.target as HTMLElement);
				visible = true;
			}, debounceTime);
		}
	}

	function maybeHide(evt: Event) {
		const id = getId(evt.target);
		if (id) {
			hideTooltip();
		}
	}

	function delayShowTooltip() {
		setTimeout(() => {
			showTooltip();
		}, 100);
	}

	function showTooltip() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			visible = true;
		}, debounceTime);
	}

	function hideTooltip() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			visible = false;
		}, debounceTime);
	}

	function hideNow() {
		visible = false;
	}
</script>

<div
	bind:this={tip}
	style:top="{topPx}px"
	style:left="{leftPx}px"
	class={[visible || 'hidden', 'absolute z-5 max-w-full']}
>
	{@render children?.(currentId)}
</div>
