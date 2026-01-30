import { error } from '@sveltejs/kit';
import { db } from '$lib/db.svelte.js';
import getUserId from '$lib/getUserId';

export const actions = {
  default: async (event) => {
    const userid = getUserId(event.platform);
    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';
    const categoryIds = unique(data.getAll('categories[]')?.map(cat => cat.toString()) ?? []);

    function unique<T>(arr: T[]): T[] {
      return [...new Set(arr)];
    }

    if (name === '' || desc === '') error(400);

    const id = crypto.randomUUID();

    await db.createIdea(userid, event.params.catalogId, { id, name, desc, categoryIds });
  }
};