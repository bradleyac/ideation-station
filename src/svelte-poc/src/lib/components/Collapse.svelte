<script lang="ts">
	const props = $props();
</script>

<details {...props} class="group relative rounded-sm flex flex-col border-1 h-auto open:h-fit">
	<!-- TODO does summary have :open applied to it as well? -->
	<!-- Answer: It does not, but you can use in-open: as if it did. -->
	<summary
		class="flex p-4 group-open:border-b-1 group-open:before:transform-[rotate(90deg)] hover:cursor-pointer select-none"
		>{props.title}</summary
	>
	<div class="flex m-2">
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
			content: '\e08f';
			transition: transform 0.25s;
			place-self: center;
			margin-right: 0.5em;
		}
	}
</style>
