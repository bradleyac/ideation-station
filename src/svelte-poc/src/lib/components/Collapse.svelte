<script lang="ts">
	const props = $props();
</script>

<!-- // TODO: figure out transitioning open/close -->
<details
	{...props}
	class={[
		'group relative rounded-sm flex flex-col border-1 h-auto open:h-fit',
		props.disabled && 'opacity-50'
	]}
>
	<summary
		inert={props.disabled}
		class="flex p-4 group-open:border-b-1 group-open:before:transform-[rotateX(180deg)] hover:cursor-pointer select-none"
		>{props.title}</summary
	>
	<div class="m-2 flex">
		{@render props.children?.()}
	</div>
</details>

<style>
	/* Not replacing this with tailwind, at least not yet. Too much going on.*/
	details {
		summary::before {
			font-family: uicons-regular-rounded !important;
			font-style: normal;
			font-weight: normal !important;
			font-variant: normal;
			text-transform: none;
			line-height: 1;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			display: inline-block;
			/* fi-rr-angle-right */
			content: '\e098';
			transition: transform 0.2s;
			place-self: center;
			margin-right: 0.5em;
		}
	}
</style>
