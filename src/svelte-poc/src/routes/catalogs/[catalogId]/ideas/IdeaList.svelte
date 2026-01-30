<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Collapse from '$lib/components/Collapse.svelte';
	import { type Idea as IdeaT } from '$lib/types';
	import { flip } from 'svelte/animate';
	import IdeaMenu from './IdeaMenu.svelte';
	import IdeaPreview from './IdeaPreview.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	const {
		ideas,
		...props
	}: {
		ideas: IdeaT[];
		categoryId?: string;
		otherIdea?: { id: string; related: boolean };
		title: string;
		catalogId: string;
	} = $props();

	let mode = $state<'default' | 'compact'>('default');

	let sortDir = $state<'alpha' | 'alphaR'>('alpha');
	let shook = $state<'shake1' | 'shake2' | undefined>();

	function shake() {
		shook = shook === 'shake1' ? 'shake2' : 'shake1';
	}

	function sort() {
		sortDir = sortDir === 'alpha' ? 'alphaR' : 'alpha';
		shook = undefined;
	}

	const sortedIdeas = $derived(
		ideas.toSorted((a, b) =>
			shook
				? Math.random() - 0.5
				: sortDir === 'alpha'
					? a.name > b.name
						? 1
						: -1
					: sortDir === 'alphaR'
						? a.name > b.name
							? -1
							: 1
						: 0
		)
	);

	const anyIdeas = $derived(ideas?.length > 0);
	let container = $state<HTMLElement>();
</script>

<Collapse class="relative" title={props.title} open={anyIdeas} disabled={!anyIdeas}>
	<div class="absolute top-1.5 right-1.5 flex gap-1.5">
		<Button onclick={() => (mode = mode === 'default' ? 'compact' : 'default')}
			><i
				class={[
					'fi',
					mode === 'default' && 'fi-rr-layout-fluid',
					mode === 'compact' && 'fi-rr-table-list'
				]}
			></i></Button
		>
		<div class="flex">
			<Button lit={!!shook} rounded="start" onclick={shake}><i class="fi fi-rr-shuffle"></i></Button
			>
			<Button lit={!shook} rounded="end" onclick={sort}
				><i
					class={[
						'fi',
						sortDir === 'alpha' && 'fi-rr-sort-alpha-down',
						sortDir === 'alphaR' && 'fi-rr-sort-alpha-up'
					]}
				></i></Button
			>
		</div>
	</div>
	<div bind:this={container} class={['relative flex flex-col w-full', mode === 'default' && 'm-2']}>
		<Tooltip parent={container}>
			{#snippet children(id, close)}
				<IdeaMenu
					idea={ideas.filter((idea) => idea.id === id)[0]}
					categoryId={props.categoryId}
					otherIdea={props.otherIdea}
					{close}
				/>
			{/snippet}
		</Tooltip>
		<ul
			class={[
				'list-none flex',
				mode === 'default' && 'flex-row flex-wrap gap-2',
				mode === 'compact' && 'flex-col w-full divide-y'
			]}
		>
			{#each sortedIdeas as idea (idea.id)}
				<li animate:flip={{ duration: 500 }} class={[mode === 'compact' && 'ring-1']}>
					<IdeaPreview catalogId={props.catalogId} {idea} {mode} />
				</li>
			{/each}
		</ul>
	</div>
</Collapse>
