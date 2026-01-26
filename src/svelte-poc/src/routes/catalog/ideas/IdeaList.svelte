<script lang="ts">
	import { tooltipAttachment } from '$lib/attachments/floatingui.svelte';
	import Button from '$lib/components/Button.svelte';
	import Collapse from '$lib/components/Collapse.svelte';
	import { type Idea as IdeaT } from '$lib/types';
	import IdeaMenu from './IdeaMenu.svelte';
	import IdeaPreview from './IdeaPreview.svelte';

	const {
		ideas,
		...props
	}: {
		ideas: IdeaT[];
		categoryId?: string;
		otherIdea?: { id: string; related: boolean };
		title: string;
	} = $props();

	let mode = $state<'default' | 'compact'>('default');

	let sort = $state<'alpha' | 'alphaR'>('alpha');

	const sortedIdeas = $derived(
		ideas.toSorted((a, b) =>
			sort === 'alpha'
				? a.name > b.name
					? 1
					: -1
				: sort === 'alphaR'
					? a.name > b.name
						? -1
						: 1
					: 0
		)
	);

	let currentIdea = $state<IdeaT | undefined>(undefined);

	function setCurrent(id: string) {
		currentIdea = ideas.filter((idea) => idea.id === id)[0];
	}

	let menu = $state<HTMLElement>();
</script>

<Collapse
	class="relative"
	title={props.title}
	open={true}
	{@attach tooltipAttachment({ tip: menu, setCurrent })}
>
	<IdeaMenu
		bind:ref={menu}
		idea={currentIdea}
		categoryId={props.categoryId}
		otherIdea={props.otherIdea}
	/>
	<div class="absolute top-1.5 right-1.5 flex gap-1.5">
		<Button onclick={() => (mode = mode === 'default' ? 'compact' : 'default')}>{mode}</Button>
		<Button onclick={() => (sort = sort === 'alpha' ? 'alphaR' : 'alpha')}
			><i
				class={[
					'fi',
					sort === 'alpha' && 'fi-rr-sort-alpha-down',
					sort === 'alphaR' && 'fi-rr-sort-alpha-up'
				]}
			></i></Button
		>
	</div>
	<ul
		class={[
			'list-none flex',
			mode === 'default' && 'flex-row flex-wrap gap-2',
			mode === 'compact' && 'flex-col w-full divide-y'
		]}
	>
		{#each sortedIdeas as idea (idea.id)}
			<li class={[mode === 'compact' && 'ring-1']}>
				<IdeaPreview {idea} {mode} />
			</li>
		{/each}
	</ul>
</Collapse>
