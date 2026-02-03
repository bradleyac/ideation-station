import { db } from '$lib/server/db.svelte.js';
import getUserId from '$lib/server/getUserId';
import { error } from '@sveltejs/kit';

export async function load({ depends, params, platform }) {
  depends(`data:idea/${params.ideaId}`);
  const userId = getUserId(platform);
  const idea = await db.getIdea(userId, params.ideaId);

  if (!idea) error(404);

  return {
    parentId: params.catalogId,
    idea,
    title: `Idea: ${idea.name}`,
    relatedIdeas: await db.getRelatedIdeas(userId, params.ideaId),
  };
}

export const actions = {
  default: async (event) => {
    const userId = getUserId(event.platform);
    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';
    const categoryId = data.get('category')?.toString() ?? undefined;

    if (name === '' || desc === '') error(400);

    await db.updateIdea(userId, { id: event.params.ideaId, name, desc, categoryId });
  },
};