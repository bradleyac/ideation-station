<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getCategoryIdeaIds } from '$lib/remotes/category.remote';
	import {
		deleteIdea,
		getIdea,
		getRelatedIdeaIds,
		getUnrelatedIdeaIds,
		linkIdea,
		unlinkIdea
	} from '$lib/remotes/idea.remote';
	import Idea from './Idea.svelte';
	let props = $props();
	let idea = $derived(await getIdea(props.ideaId));

	function hideMenu() {
		props.close();
	}

	async function removeIdea() {
		if (!idea) return;
		if (confirm(`Really delete "${idea.name}"?`)) {
			hideMenu();
			if (props.otherIdea?.id) {
				await deleteIdea({ id: props.ideaId, otherId: props.otherIdea?.id }).updates(
					getCategoryIdeaIds(idea.categoryId).withOverride((current) =>
						current.filter((id) => id !== idea.id)
					),
					getRelatedIdeaIds(props.otherIdea?.id).withOverride((current) =>
						current.filter((id) => id !== props.otherIdea?.id)
					),
					getUnrelatedIdeaIds(props.otherIdea?.id).withOverride((current) =>
						current.filter((id) => id !== props.otherIdea?.id)
					)
				);
			} else {
				await deleteIdea({ id: props.ideaId }).updates(
					getCategoryIdeaIds(idea.categoryId).withOverride((current) =>
						current.filter((id) => id !== idea.id)
					)
				);
			}
		}
	}

	async function addToIdea(otherIdea: { id: string; related: boolean }) {
		if (!idea) return;
		hideMenu();
		await linkIdea({ id: idea.id, otherId: otherIdea.id }).updates(
			getUnrelatedIdeaIds(idea.id).withOverride((current) =>
				current.filter((id) => id !== otherIdea.id)
			),
			getUnrelatedIdeaIds(otherIdea.id).withOverride((current) =>
				current.filter((id) => id !== idea.id)
			),
			getRelatedIdeaIds(idea.id).withOverride((current) => [...current, otherIdea.id]),
			getRelatedIdeaIds(otherIdea.id).withOverride((current) => [...current, idea.id])
		);
	}

	async function removeFromIdea(otherIdea: { id: string; related: boolean }) {
		if (!idea) return;
		hideMenu();
		await unlinkIdea({ id: idea.id, otherId: otherIdea.id }).updates(
			getUnrelatedIdeaIds(idea.id).withOverride((current) => [...current, otherIdea.id]),
			getUnrelatedIdeaIds(otherIdea.id).withOverride((current) => [...current, idea.id]),
			getRelatedIdeaIds(idea.id).withOverride((current) =>
				current.filter((id) => id !== otherIdea.id)
			),
			getRelatedIdeaIds(otherIdea.id).withOverride((current) =>
				current.filter((id) => id !== idea.id)
			)
		);
	}
</script>

<div
	class="relative shadow-black shadow-sm rounded-sm w-max max-w-full md:max-w-md top-0 left-0 flex-col gap-4 bg-eucalyptus-200 dark:bg-eucalyptus-800 p-4"
>
	{#if props.ideaId}
		<Idea ideaId={props.ideaId} />
		<div class="flex mt-3 w-full justify-end gap-2">
			<Button
				onclick={(e: Event) => {
					e.stopPropagation();
					props.close();
				}}
				tabindex="-1"
				title="Close"><i class="fi fi-rr-cross"></i></Button
			>
			<Button
				class="btn-primary"
				title="Delete Idea"
				onclick={(e: Event) => {
					e.stopPropagation();
					removeIdea();
				}}
			>
				<i class="fi fi-rr-trash"></i>
			</Button>
			{#if props.otherIdea}
				{#if props.otherIdea.related}
					<Button
						class="btn-primary"
						title="Unlink Related Idea"
						onclick={(e: Event) => {
							e.stopPropagation();
							removeFromIdea(props.otherIdea);
						}}
					>
						<i class="fi fi-rr-link-slash"></i>
					</Button>
				{:else}
					<Button
						class="btn-primary"
						title="Link Related Idea"
						onclick={(e: Event) => {
							e.stopPropagation();
							addToIdea(props.otherIdea);
						}}
					>
						<i class="fi fi-rr-link"></i>
					</Button>
				{/if}
			{/if}
		</div>
	{/if}
</div>
