import { db } from '$lib/db.svelte.js';
import { error } from '@sveltejs/kit';

export async function load({ depends, params, parent }) {
  depends(`data:category/${params.categoryId}`);
  const ideaIds = params.categoryId === 'Uncategorized' ? await db.getUncategorizedIdeaIds() : await db.getIdeaIdsByCategory(params.categoryId);

  const category = params.categoryId === 'Uncategorized' ? { id: 'Uncategorized', name: 'Uncategorized', count: ideaIds.length } : await db.getCategoryById(params.categoryId);

  if (!category) error(404);

  return {
    ideaIds,
    category,
    title: "Category: " + category.name,
  };
}

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';

    if (name === '' || desc === '') error(400);

    await db.updateCategory({ id: event.params.categoryId, name, desc, ideaIds: [] });
  },
};