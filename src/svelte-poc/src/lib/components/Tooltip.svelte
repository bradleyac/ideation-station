<script lang="ts">
	import { computePosition, flip, shift } from '@floating-ui/dom';
	import { tick, type Snippet } from 'svelte';
	import { on } from 'svelte/events';
	let { children, parent }: { children: Snippet<[string, () => void]>; parent: HTMLElement } =
		$props();
	let visible = $state(false);
	let tip = $state<HTMLDivElement>();
	let leftPx = $state(0);
	let topPx = $state(0);
	let currentId = $state('');

	const debounceTime = 150;

	let timeoutId: NodeJS.Timeout;

	function getId(target: any): string | undefined {
		return (target as HTMLElement).dataset?.['id'];
	}

	$effect(() => {
		return on(document, 'keydown', (e) => e.key === 'Escape' && hideNow());
	});

	const tipEvents = [
		['mouseleave', hideTooltip],
		['mouseenter', showTooltip],
		['touchend', () => setTimeout(clear, 50)] // Delayed 50ms because touchend happens before focusout
	] as const;

	const parentEvents = [
		['mouseover', maybeShow],
		['focusin', maybeShow],
		['mouseout', maybeHide],
		['focusout', maybeHide],
		['touchend', maybeFocusAndPreventDefault]
	] as const;

	$effect(() => {
		const offs = [
			...(tip ? tipEvents.map(([eventNames, handler]) => on(tip!, eventNames, handler)) : []),
			...(parent
				? parentEvents.map(([eventNames, handler]) => on(parent!, eventNames, handler))
				: [])
		];
		return () => {
			offs.forEach((off) => off());
		};
	});

	function maybeFocusAndPreventDefault(evt: Event) {
		const anchor = evt.target as HTMLAnchorElement;
		if (!!anchor?.href && anchor !== document.activeElement) {
			console.log('Prevented touchend');
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
			timeoutId = setTimeout(async () => {
				currentId = id;
				visible = true;
				await tick();
				await tick();
				update(evt.target as HTMLElement);
			}, debounceTime);
		}
	}

	function maybeHide(evt: Event) {
		const id = getId(evt.target);
		if (id) {
			hideTooltip();
		}
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
		clearTimeout(timeoutId);
		visible = false;
	}

	function clear() {
		clearTimeout(timeoutId);
	}
</script>

<div
	bind:this={tip}
	style:top="{topPx}px"
	style:left="{leftPx}px"
	class={[visible || 'hidden', 'absolute z-5 max-w-full']}
>
	{#key currentId}
		{@render children?.(currentId, hideNow)}
	{/key}
</div>
