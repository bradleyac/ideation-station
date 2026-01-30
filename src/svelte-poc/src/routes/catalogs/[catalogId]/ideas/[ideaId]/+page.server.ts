import { db } from '$lib/db.svelte.js';
import getUserId from '$lib/getUserId';
import { error } from '@sveltejs/kit';

export async function load({ depends, params, platform }) {
  depends(`data:idea/${params.ideaId}`);
  const userid = getUserId(platform);
  const idea = await db.getIdea(userid, params.ideaId);

  if (!idea) error(404);

  return {
    parentId: params.catalogId,
    idea,
    title: `Idea: ${idea.name}`,
    relatedIdeas: await db.getRelatedIdeas(userid, params.ideaId),
  };
}

export const actions = {
  default: async (event) => {
    const userid = getUserId(event.platform);
    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';
    const categoryIds = unique(data.getAll('categories[]')?.map(cat => cat.toString()).filter(cat => cat != 'Uncategorized') ?? []);

    function unique<T>(arr: T[]): T[] {
      return [...new Set(arr)];
    }

    if (name === '' || desc === '') error(400);

    await db.updateIdea(userid, { id: event.params.ideaId, name, desc, categoryIds });
  },
};