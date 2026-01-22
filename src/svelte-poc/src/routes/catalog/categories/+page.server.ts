import { db } from "$lib/db.svelte";
import { error } from "@sveltejs/kit";

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';

    if (name === '' || desc === '') error(400);

    const id = crypto.randomUUID();

    await db.createCategory({ id, name, desc, ideaIds: [] });
  },
};