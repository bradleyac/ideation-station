<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();

	const route = $derived(page.route);
	const title = $derived(page.data.title);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div id="__layout-container">
	<nav>
		<ul>
			{#each [['/', 'Home', ''], ['/ideas', 'Idea Catalog', 'Idea']] as [path, pageName, subPageName]}
				<li>
					{#if route.id === path}
						{pageName}
					{:else}
						<a href={path}>{pageName}</a>
						{#if route.id === `${path}/[id]`}
							&gt;
							{title ?? subPageName}
						{/if}
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
	<div>
		{@render children()}
	</div>
</div>

<template></template>

<style>
	#__layout-container {
		> div {
			margin: 0 1em 1em 1em;
		}
	}

	nav {
		padding: 1em;
		background: var(--color-secondary);
		overflow: hidden;

		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			gap: 1em;
			overflow: hidden;
		}

		a {
			color: inherit;
		}

		li {
			max-width: 50em;
			overflow: hidden;
			text-wrap: nowrap;
			text-overflow: ellipsis;
		}
	}
</style>
