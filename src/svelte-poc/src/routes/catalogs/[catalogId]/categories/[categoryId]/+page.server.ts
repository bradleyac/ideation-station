import { db } from '$lib/db.svelte.js';
import getUserId from '$lib/getUserId';
import { error } from '@sveltejs/kit';

export async function load({ depends, params, platform, ...props }) {
  const userid = getUserId(platform);
  depends(`data:category/${params.categoryId}`);
  const ideaIds = params.categoryId === 'Uncategorized' ? await db.getUncategorizedIdeaIds(userid, params.catalogId) : await db.getIdeaIdsByCategory(userid, params.categoryId);

  const category = params.categoryId === 'Uncategorized' ? { id: 'Uncategorized', name: 'Uncategorized', desc: 'Ideas without categories.', count: 0 } : await db.getCategoryById(userid, params.categoryId);

  return {
    parentId: params.catalogId,
    ideaIds,
    category,
    title: `Category: ${category.name}`,
  };
}

export const actions = {
  default: async (event) => {
    const userid = getUserId(event.platform);

    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';

    if (name === '' || desc === '') error(400);

    await db.updateCategory(userid, { id: event.params.categoryId, name, desc, ideaIds: [] });
  },
};