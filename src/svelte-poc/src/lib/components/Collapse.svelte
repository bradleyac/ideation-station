<script lang="ts">
	const { children, title, open = false } = $props();
</script>

<details {open} class="bg-eucalyptus-100 dark:bg-eucalyptus-900">
	<summary
		class="inline-block p-4 select-none bg-eucalyptus-400 dark:bg-eucalyptus-600 hover:bg-eucalyptus-300 dark:hover:bg-eucalyptus-700"
		>{title}</summary
	>
	<div class="flex m-4">
		{@render children()}
	</div>
</details>

<style>
	/* Not replacing this with tailwind, at least not yet. Too much going on.*/
	details {
		position: relative;
		border-radius: 0;
		@media (width >= 48rem) {
			border-radius: 1em;
		}
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 1px black;
		max-width: 100%;

		&:not([open]) {
			height: fit-content;
		}

		summary {
			list-style-type: none;
			display: flex;
			user-select: none;
			border-radius: 0;
			@media (width >= 48rem) {
				border-radius: 1em;
			}
			&:hover {
				cursor: pointer;
			}
		}

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
			/* fi-rr-angle-small-right */
			/* content: '\e092'; */
			/* fi-rr-angle-right */
			content: '\e08f';
			transition: transform 0.25s;
			place-self: center;
			margin-right: 0.5em;
		}

		&[open] summary {
			/* background-color: var(--color-primary-contrast); */
			border-radius: 0;
			@media (width >= 48rem) {
				border-radius: 1em 1em 0 0;
			}

			&::before {
				transform: rotate(90deg);
			}
		}
	}
</style>
