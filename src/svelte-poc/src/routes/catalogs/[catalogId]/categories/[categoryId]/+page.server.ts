import { db } from '$lib/server/db.svelte.js';
import getUserId from '$lib/server/getUserId';
import { error } from '@sveltejs/kit';

export async function load({ depends, params, platform, ...props }) {
  const userId = getUserId(platform);
  depends(`data:category/${params.categoryId}`);
  const ideaIds = params.categoryId === 'Uncategorized' ? await db.getUncategorizedIdeaIds(userId, params.catalogId) : await db.getIdeaIdsByCategory(userId, params.categoryId);
  const category = params.categoryId === 'Uncategorized' ? { id: 'Uncategorized', name: 'Uncategorized', desc: 'Ideas without categories.', ideaIds } : await db.getCategoryById(userId, params.categoryId);

  return {
    parentId: params.catalogId,
    ideaIds,
    category,
    title: `Category: ${category?.name}`,
  };
}

export const actions = {
  default: async (event) => {
    const userId = getUserId(event.platform);

    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';

    if (name === '') error(400);

    await db.updateCategory(userId, { id: event.params.categoryId, name, desc, ideaIds: [] });
  },
};