import { db } from "$lib/db.svelte";
import getUserId from "$lib/getUserId";
import { error } from "console";

export async function load({ depends, params, platform }) {
  depends(`data:catalog/${params.catalogId}`);
  const userid = getUserId(platform);
  const catalog = await db.getCatalog(userid, params.catalogId);

  if (!catalog) error(404);

  return {
    catalog: catalog,
    title: `Catalog: ${catalog.name}`,
  };
}

export const actions = {
  default: async (event) => {
    const userid = getUserId(event.platform);

    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';

    if (name === '' || desc === '') error(400);

    await db.updateCatalog(userid, { id: event.params.catalogId, name, desc });
  },
};