import { ideas } from '$lib/data.svelte.js'
import { error } from '@sveltejs/kit';

export function load({ params }) {
  const idea = ideas.get(params.id);

  if (!idea) error(404);

  return {
    idea
  };
}