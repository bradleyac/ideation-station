<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div id="__layout-container">
	<nav>
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/ideas">Idea Catalog</a></li>
		</ul>
	</nav>
	<div>
		{@render children()}
	</div>
</div>

<style>
	#__layout-container {
		> div {
			margin: 1em;
		}
	}

	nav {
		padding: 1em;
		background: var(--color-secondary);

		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			gap: 1em;
		}
		a {
			color: inherit;
		}
	}
</style>
