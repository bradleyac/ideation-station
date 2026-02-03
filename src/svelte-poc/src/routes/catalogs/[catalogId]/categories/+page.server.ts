import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import { error } from "@sveltejs/kit";

export const actions = {
  default: async (event) => {
    const userId = getUserId(event.platform);

    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';

    if (name === '') error(400);

    const id = crypto.randomUUID();

    await db.createCategory(userId, event.params.catalogId, { id, name, desc, ideaIds: [] });
  },
};