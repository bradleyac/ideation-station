import { db } from '$lib/server/db.svelte.js';
import getUserId from '$lib/server/getUserId';
import { error } from '@sveltejs/kit';

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