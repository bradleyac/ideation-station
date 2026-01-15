import { db } from '$lib/db.svelte.js';
import { error } from '@sveltejs/kit';

export async function load({ depends, params }) {
  depends(`data:idea/${params.ideaId}`);
  const idea = await db.getIdea(params.ideaId);
  const relatedIdeas = await db.getRelatedIdeas(params.ideaId);

  if (!idea) error(404);

  return {
    idea,
    relatedIdeas,
    title: "Idea: " + idea.name,
  };
}

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';
    const categoryIds = unique(data.getAll('categories[]')?.map(cat => cat.toString()).filter(cat => cat != 'Uncategorized') ?? []);

    function unique<T>(arr: T[]): T[] {
      return [...new Set(arr)];
    }

    if (name === '' || desc === '') error(400);

    await db.updateIdea({ id: event.params.ideaId, name, desc, categoryIds });
  },
};