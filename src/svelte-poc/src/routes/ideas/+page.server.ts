import { error } from '@sveltejs/kit';
import { db } from '$lib/db.svelte.js';

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('text')?.toString() ?? '';
    const categories = unique(data.getAll('categories[]')?.map(cat => cat.toString()) ?? []);

    function unique<T>(arr: T[]): T[] {
      return [...new Set(arr)];
    }

    if (name === '' || desc === '') error(400);

    const id = crypto.randomUUID();

    await db.createIdea({ id, name, desc, categories });
  },
};