<script>
	import Idea from '../Idea.svelte';
	const { data } = $props();
</script>

<Idea idea={data.idea} />
