import { ideas } from '$lib/data.svelte.js';
import { error } from '@sveltejs/kit';

let id = 0;

export function load({ params }) {
  const localIdeas = ideas;

  return {
    localIdeas
  };
}

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const name = data.get('name')?.toString() ?? '';
    const text = data.get('text')?.toString() ?? '';

    if (name === '' || text === '') error(400);

    const newId = crypto.randomUUID();

    ideas.set(newId, { id: newId, name: data.get('name')?.toString() ?? '', text: data.get('text')?.toString() ?? '' });
  }
};