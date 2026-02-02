import { error } from '@sveltejs/kit';
import { db } from '$lib/db.svelte.js';
import getUserId from '$lib/getUserId';

export const actions = {
  default: async (event) => {
    const userid = getUserId(event.platform);
    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';
    const categoryId = data.get('category')?.toString() ?? undefined;

    if (name === '' || desc === '') error(400);

    const id = crypto.randomUUID();

    await db.createIdea(userid, event.params.catalogId, { id, name, desc, categoryId });
  }
};