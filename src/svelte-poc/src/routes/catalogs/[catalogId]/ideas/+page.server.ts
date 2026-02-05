import { db } from '$lib/server/db.svelte.js';
import getUserId from '$lib/server/getUserId';
import { error } from '@sveltejs/kit';

export const actions = {
  default: async (event) => {
    const userId = getUserId(event.platform);
    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';
    const categoryId = data.get('category')?.toString() ?? undefined;

    if (name === '' || desc === '') error(400);

    const id = crypto.randomUUID();

    await db.createIdea(userId, event.params.catalogId, { id, name, desc, categoryId });
  }
};