<script lang="ts">
	import { trapFocus } from '@zag-js/focus-trap';

	let { showModal = $bindable(), children } = $props();
	let dialog = $state<HTMLDialogElement | null>(null);
	let closeButton = $state<HTMLButtonElement | null>(null);

	$effect(() => {
		if (showModal) {
			dialog?.showModal();
			closeButton?.blur();
			return trapFocus(dialog);
		} else {
			dialog?.close();
		}
	});

	const dialogSizeClasses = 'max-h-svh h-max max-w-svw w-full top-0 min-[32rem]:top-20';
	const containerSizeClasses = 'h-max w-max max-w-full max-[32rem]:min-w-full min-[32rem]:min-w-lg';
</script>

<dialog
	class={[
		'relative overflow-visible outline-none bg-transparent open:flex open:flex-col open:place-items-center open:animate-zoom backdrop:bg-black/70 open:backdrop:animate-fade',
		dialogSizeClasses
	]}
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (e.target === dialog) dialog?.close();
	}}
	tabindex="-1"
>
	<div
		tabindex="-1"
		class={['mx-auto flex outline-none place-items-center relative p-1', containerSizeClasses]}
	>
		{@render children?.()}
		<button
			bind:this={closeButton}
			onclick={() => dialog?.close()}
			class="absolute border-none top-1.5 right-1.5 rounded-sm bg-eucalyptus-300/50 dark:bg-eucalyptus-700/50"
			title="Close Dialog"><i class="fi fi-rr-cross"></i></button
		>
	</div>
</dialog>
