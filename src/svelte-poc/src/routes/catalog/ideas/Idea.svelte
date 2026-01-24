<script lang="ts">
	const props = $props();
</script>

<div class="flex flex-col min-w-xs md:min-w-sm gap-2">
	<h2 class="text-lg">{props.idea.name}</h2>

	<pre>{props.idea.desc}</pre>
</div>
