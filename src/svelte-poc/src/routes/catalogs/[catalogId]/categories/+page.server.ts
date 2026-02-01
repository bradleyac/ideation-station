import { db } from "$lib/db.svelte";
import getUserId from "$lib/getUserId";
import { error } from "@sveltejs/kit";

export const actions = {
  default: async (event) => {
    const userid = getUserId(event.platform);

    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';

    if (name === '') error(400);

    const id = crypto.randomUUID();

    await db.createCategory(userid, event.params.catalogId, { id, name, desc, ideaIds: [] });
  },
};