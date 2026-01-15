<script lang="ts">
	import type { Category } from '$lib/types';

	const { category }: { category: Category } = $props();
</script>

<a class="category__badge" href="/catalog/categories/{category.id}">
	<span>
		{category.name}
	</span>
	<div style:margin="-.25em .5em" style:border-right=".5px solid black"></div>
	<span>
		{category.count ?? 0}
	</span>
</a>

<style>
	.category__badge {
		display: grid;
		grid-template-columns: auto min-content;
		grid-auto-flow: column;
		text-decoration: none;
		color: inherit;
		background-color: var(--color-primary);
		padding: 0.25em 0.75em;
		border-radius: 1em;
		box-shadow: 0 0 1px 0 black;

		max-width: 100%;
		&:hover {
			box-shadow: 0 0 0.25em 0 black;
			z-index: 1;
			transform: scale(1.05);
		}

		span {
			text-overflow: ellipsis;
			text-wrap: nowrap;
			overflow: hidden;
		}
	}
</style>
