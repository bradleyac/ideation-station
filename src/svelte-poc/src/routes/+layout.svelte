<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import 'tippy.js/dist/tippy.css';

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
			{#each [{ path: '/', name: 'Home', subPages: [] }, { path: '/catalog', name: 'Idea Catalog', subPages: ['/ideas/[ideaId]', '/categories/[categoryId]'] }] as { path, name, subPages }}
				<li style:display="flex" style:gap=".5em">
					{#if route.id === path}
						{name}
					{:else}
						<a href={path}>{name}</a>
						{#each subPages as subPath}
							{#if route.id === `${path}${subPath}`}
								<div style:border-right="1px solid var(--text-color)"></div>
								{title ?? ''}
							{/if}
						{/each}
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
		height: 4em;
		align-content: center;

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
