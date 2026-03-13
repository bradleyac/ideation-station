<script lang="ts">
	import Modal from './Modal.svelte';

	const { src, alt, ...restProps } = $props();
	let showModal = $state(false);
</script>

<button
	class={[
		restProps.class,
		'shadow-md/50 flex h-max w-full outline-2 outline-eucalyptus-600 dark:outline-eucalyptus-400 rounded-sm'
	]}
	onclick={() => (showModal = !showModal)}
>
	<img class="w-auto rounded-sm object-contain object-center" {src} {alt} />
</button>

<Modal bind:showModal>
	<img
		class="ring-2 ring-eucalyptus-600 dark:ring-eucalyptus-400 rounded-sm h-full w-auto max-[32rem]:max-w-full lg:max-w-4xl"
		{src}
		{alt}
	/>
</Modal>
