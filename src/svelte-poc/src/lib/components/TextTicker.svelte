<script lang="ts">
	import * as Rx from 'rxjs';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	const { labels, period } = $props();
	let index = $state(0);

	onMount(() => {
		let visibilityChange$ = Rx.fromEvent(document, 'visibilitychange').pipe(
			Rx.map((x) => document.visibilityState),
			Rx.startWith('visible'),
			Rx.shareReplay(1)
		);

		let isVisible$ = visibilityChange$.pipe(
			Rx.map(() => document.visibilityState === 'visible'),
			Rx.distinctUntilChanged()
		);

		let index$ = Rx.connectable<number>(
			Rx.interval(period).pipe(
				Rx.map((i) => (i + 1) % labels.length),
				Rx.startWith(0)
			),
			{
				connector: () => new Rx.ReplaySubject(1),
				resetOnDisconnect: false
			}
		);

		let subs = [];

		subs.push(index$.connect());

		subs.push(
			isVisible$
				.pipe(
					Rx.switchMap((isVisible) =>
						isVisible
							? index$.pipe(
									Rx.throttleTime(period, Rx.asyncScheduler, { leading: true, trailing: true })
								)
							: Rx.NEVER
					)
				)
				.subscribe((i) => (index = i))
		);

		return () => subs.forEach((sub) => sub.unsubscribe());
	});

	let current = $derived(labels[index]);
</script>

<div class="text-3xl grid place-items-end">
	{#key current}
		<p class="m-0" in:fade={{ delay: 1000 }} out:fade={{ duration: 750 }}>
			{current}
		</p>
	{/key}
</div>
