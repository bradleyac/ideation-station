<script lang="ts">
	const { children, title, open = false } = $props();
</script>

<details {open}>
	<summary>{title}</summary>
	<div class="children__container">
		{@render children()}
	</div>
</details>

<style>
	.children__container {
		display: flex;
		margin: 1em;
	}

	details {
		position: relative;
		background-color: var(--color-primary);
		border-radius: 1em;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 1px black;

		summary {
			list-style-type: none;
			display: flex;
			/* font-weight: bold; */
			/* font-size: 1.5em; */
			user-select: none;
			padding: 0.5em;
			border-radius: 1em;

			&:hover {
				cursor: pointer;
				background-color: var(--color-primary-contrast);
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
			/* fi-rr-angle-right */
			content: '\e092';
			transition: transform 0.25s;
			place-self: center;
			margin-right: 0.5em;
		}

		&[open] summary {
			background-color: var(--color-primary-contrast);
			border-radius: 1em 1em 0 0;

			&::before {
				transform: rotate(90deg);
			}
		}
	}
</style>
