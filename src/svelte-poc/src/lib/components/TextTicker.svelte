<script lang="ts">
	import { onMount } from 'svelte';
	import { on } from 'svelte/events';
	import { fade } from 'svelte/transition';

	const { labels, period } = $props();

	let index = $state(0);
	let running = $state(false);
	let intervalId = $state<NodeJS.Timeout>();
	const current = $derived(labels[index]);

	onMount(() => {
		// Turn the interval off when it isn't visible to avoid queuing animations.
		on(document, 'visibilitychange', () => setRunning(document.visibilityState === 'visible'));
		setRunning(true);
	});

	function setRunning(newRunning: boolean) {
		if (running !== newRunning) {
			if (running) {
				stop();
			} else {
				start();
			}
			running = newRunning;
		}
	}

	function stop() {
		clearInterval(intervalId);
	}

	function start() {
		intervalId = setInterval(next, period);
	}

	function next() {
		index = (index + 1) % labels.length;
	}
</script>

<div class="text-xl grid place-items-end">
	{#key current}
		<p class="m-0" in:fade={{ delay: 1000 }} out:fade={{ duration: 750 }}>
			{current}
		</p>
	{/key}
</div>
