<script lang="ts">
	import { trapFocus } from '@zag-js/focus-trap';

	let { showModal = $bindable(), children } = $props();
	let dialog = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		if (showModal) {
			dialog?.showModal();
			return trapFocus(dialog);
		} else {
			dialog?.close();
		}
	});
</script>

<dialog
	class="relative top-0 lg:top-20 bg-transparent max-w-full! w-full open:flex open:flex-col open:place-items-center open:animate-zoom backdrop:bg-black/50 open:backdrop:animate-fade"
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (e.target === dialog) dialog?.close();
	}}
>
	<div class="flex place-items-center relative w-full max-w-lg">
		{@render children?.()}
		<button
			onclick={() => dialog?.close()}
			tabindex="-1"
			class="absolute border-none top-1 right-1"
			title="Close Dialog"><i class="fi fi-rr-cross"></i></button
		>
	</div>
</dialog>
